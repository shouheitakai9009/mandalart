import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

// POST /api/tasks/[id]/increment - タスクの実行回数をインクリメント
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
      include: {
        goal: {
          include: {
            mandalart: true,
          },
        },
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // 完了済みまたは削除済みのマンダラートのタスクは編集不可
    if (
      existingTask.goal.mandalart.status === 'COMPLETED' ||
      existingTask.goal.mandalart.deletedAt
    ) {
      return NextResponse.json(
        { error: 'Cannot increment task of completed or deleted mandalart' },
        { status: 400 }
      );
    }

    // 目標回数を超えないようにチェック
    if (existingTask.currentCount >= existingTask.targetCount) {
      return NextResponse.json(
        { error: 'Task already completed (current count >= target count)' },
        { status: 400 }
      );
    }

    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        currentCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Task count incremented successfully',
      data: task,
    });
  } catch (error) {
    console.error('Error incrementing task:', error);
    return NextResponse.json(
      { error: 'Failed to increment task' },
      { status: 500 }
    );
  }
}
