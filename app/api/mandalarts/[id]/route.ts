import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { updateMandalartSchema } from '../schemas';

// GET /api/mandalarts/[id] - 特定のマンダラートを取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mandalart = await prisma.mandalart.findUnique({
      where: {
        id,
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
        snapshots: {
          orderBy: {
            weekStartDate: 'desc',
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

    // 削除済みのチェック
    if (mandalart.deletedAt) {
      return NextResponse.json(
        { error: 'Mandalart has been deleted' },
        { status: 410 }
      );
    }

    return NextResponse.json(mandalart);
  } catch (error) {
    console.error('Error fetching mandalart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mandalart' },
      { status: 500 }
    );
  }
}

// PUT /api/mandalarts/[id] - マンダラートを更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // zodでバリデーション
    const result = updateMandalartSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: result.error.issues,
        },
        { status: 400 }
      );
    }

    const updateData = result.data;

    // マンダラートの存在確認
    const existingMandalart = await prisma.mandalart.findUnique({
      where: { id },
    });

    if (!existingMandalart) {
      return NextResponse.json(
        { error: 'Mandalart not found' },
        { status: 404 }
      );
    }

    if (existingMandalart.deletedAt) {
      return NextResponse.json(
        { error: 'Cannot update deleted mandalart' },
        { status: 400 }
      );
    }

    // 完了済みのマンダラートは編集不可
    if (existingMandalart.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot update completed mandalart' },
        { status: 400 }
      );
    }

    const mandalart = await prisma.mandalart.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(mandalart);
  } catch (error) {
    console.error('Error updating mandalart:', error);
    return NextResponse.json(
      { error: 'Failed to update mandalart' },
      { status: 500 }
    );
  }
}

// DELETE /api/mandalarts/[id] - マンダラートをソフトデリート
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const hard = searchParams.get('hard') === 'true';

    const existingMandalart = await prisma.mandalart.findUnique({
      where: { id },
    });

    if (!existingMandalart) {
      return NextResponse.json(
        { error: 'Mandalart not found' },
        { status: 404 }
      );
    }

    if (hard) {
      // ハードデリート（物理削除）
      await prisma.mandalart.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: 'Mandalart permanently deleted',
      });
    } else {
      // ソフトデリート（論理削除）
      const mandalart = await prisma.mandalart.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          status: 'DELETED',
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Mandalart soft deleted',
        data: mandalart,
      });
    }
  } catch (error) {
    console.error('Error deleting mandalart:', error);
    return NextResponse.json(
      { error: 'Failed to delete mandalart' },
      { status: 500 }
    );
  }
}
