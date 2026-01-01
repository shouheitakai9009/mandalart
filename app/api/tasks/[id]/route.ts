import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { updateTaskSchema } from '../../mandalarts/schemas';

// GET /api/tasks/[id] - 特定のタスクを取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        goal: {
          include: {
            mandalart: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[id] - タスクを更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // zodでバリデーション
    const result = updateTaskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: result.error.issues,
        },
        { status: 400 }
      );
    }

    // タスクの存在確認とマンダラートのステータス確認
    const existingTask = await prisma.task.findUnique({
      where: { id },
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
        { error: 'Cannot update task of completed or deleted mandalart' },
        { status: 400 }
      );
    }

    const task = await prisma.task.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - タスクを削除（通常は使用しない）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existingTask = await prisma.task.findUnique({
      where: { id },
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

    if (
      existingTask.goal.mandalart.status === 'COMPLETED' ||
      existingTask.goal.mandalart.deletedAt
    ) {
      return NextResponse.json(
        { error: 'Cannot delete task of completed or deleted mandalart' },
        { status: 400 }
      );
    }

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
