import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { createMandalartSchema } from './schemas';
import { Prisma } from '@prisma/client';

// GET /api/mandalarts - ユーザーのマンダラート一覧を取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // ステータスによって where オブジェクトを構築
    const where: Prisma.MandalartWhereInput = {
      userId,
      deletedAt: null,
      ...(status === 'ACTIVE' && { status: 'ACTIVE' }),
      ...(status === 'COMPLETED' && { status: 'COMPLETED' }),
      ...(status === 'DELETED' && { status: 'DELETED' }),
    };

    const mandalarts = await prisma.mandalart.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(mandalarts);
  } catch (error) {
    console.error('Error fetching mandalarts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mandalarts' },
      { status: 500 }
    );
  }
}

// POST /api/mandalarts - 新しいマンダラートを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // zodでバリデーション
    const result = createMandalartSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: result.error.issues,
        },
        { status: 400 }
      );
    }

    // 型安全なデータ
    const { userId, mainGoal, goals } = result.data;

    // マンダラートを作成（トランザクション内で目標とタスクも作成）
    const mandalart = await prisma.mandalart.create({
      data: {
        userId,
        mainGoal,
        status: 'ACTIVE',
        goals: {
          create: goals.map((goal, index) => ({
            title: goal.title,
            position: index + 1,
            tasks: {
              create: goal.tasks.map((task, taskIndex) => ({
                title: task.title,
                targetCount: task.targetCount,
                targetUnit: task.targetUnit,
                currentCount: 0,
                position: taskIndex + 1,
              })),
            },
          })),
        },
      },
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

    return NextResponse.json(mandalart, { status: 201 });
  } catch (error) {
    console.error('Error creating mandalart:', error);
    return NextResponse.json(
      { error: 'Failed to create mandalart' },
      { status: 500 }
    );
  }
}
