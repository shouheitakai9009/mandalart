import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

// GET /api/mandalarts/[id]/snapshots - マンダラートのスナップショット一覧を取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const snapshots = await prisma.mandalartSnapshot.findMany({
      where: {
        mandalartId: id,
      },
      orderBy: {
        weekStartDate: 'desc',
      },
    });

    return NextResponse.json(snapshots);
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snapshots' },
      { status: 500 }
    );
  }
}

// POST /api/mandalarts/[id]/snapshots - 新しいスナップショットを作成
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // マンダラートの存在確認
    const mandalart = await prisma.mandalart.findUnique({
      where: { id },
      include: {
        goals: {
          include: {
            tasks: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!mandalart) {
      return NextResponse.json(
        { error: 'Mandalart not found' },
        { status: 404 }
      );
    }

    // 週の開始日と終了日を計算（直近の月曜日と日曜日）
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const diffToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

    const weekStartDate = new Date(now);
    weekStartDate.setDate(now.getDate() + diffToMonday);
    weekStartDate.setHours(0, 0, 0, 0);

    const weekEndDate = new Date(now);
    weekEndDate.setDate(now.getDate() + diffToSunday);
    weekEndDate.setHours(23, 59, 59, 999);

    // 同じ週のスナップショットが既に存在するかチェック
    const existingSnapshot = await prisma.mandalartSnapshot.findFirst({
      where: {
        mandalartId: id,
        weekStartDate: {
          gte: weekStartDate,
          lte: weekEndDate,
        },
      },
    });

    if (existingSnapshot) {
      return NextResponse.json(
        { error: 'Snapshot for this week already exists' },
        { status: 400 }
      );
    }

    // スナップショットデータを作成
    const snapshotData = {
      goals: mandalart.goals.map((goal) => ({
        id: goal.id,
        title: goal.title,
        position: goal.position,
        tasks: goal.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          currentCount: task.currentCount,
          targetCount: task.targetCount,
          targetUnit: task.targetUnit,
          position: task.position,
        })),
      })),
    };

    // スナップショットを作成
    const snapshot = await prisma.mandalartSnapshot.create({
      data: {
        mandalartId: id,
        mainGoal: mandalart.mainGoal,
        snapshotData,
        weekStartDate,
        weekEndDate,
      },
    });

    return NextResponse.json(snapshot, { status: 201 });
  } catch (error) {
    console.error('Error creating snapshot:', error);
    return NextResponse.json(
      { error: 'Failed to create snapshot' },
      { status: 500 }
    );
  }
}
