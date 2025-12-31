import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { updateGoalSchema } from '../../mandalarts/schemas';

// GET /api/goals/[id] - 特定の目標を取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id: params.id },
      include: {
        tasks: {
          orderBy: {
            position: 'asc',
          },
        },
        mandalart: true,
      },
    });

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Error fetching goal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goal' },
      { status: 500 }
    );
  }
}

// PUT /api/goals/[id] - 目標を更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // zodでバリデーション
    const result = updateGoalSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: result.error.issues,
        },
        { status: 400 }
      );
    }

    // 目標の存在確認とマンダラートのステータス確認
    const existingGoal = await prisma.goal.findUnique({
      where: { id: params.id },
      include: {
        mandalart: true,
      },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // 完了済みまたは削除済みのマンダラートの目標は編集不可
    if (
      existingGoal.mandalart.status === 'COMPLETED' ||
      existingGoal.mandalart.deletedAt
    ) {
      return NextResponse.json(
        { error: 'Cannot update goal of completed or deleted mandalart' },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.update({
      where: { id: params.id },
      data: result.data,
      include: {
        tasks: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}

// DELETE /api/goals/[id] - 目標を削除（通常は使用しない）
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 目標の削除は通常推奨されないが、実装は提供
    const existingGoal = await prisma.goal.findUnique({
      where: { id: params.id },
      include: {
        mandalart: true,
      },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    if (
      existingGoal.mandalart.status === 'COMPLETED' ||
      existingGoal.mandalart.deletedAt
    ) {
      return NextResponse.json(
        { error: 'Cannot delete goal of completed or deleted mandalart' },
        { status: 400 }
      );
    }

    await prisma.goal.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    );
  }
}
