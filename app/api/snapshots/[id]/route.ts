import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

// GET /api/snapshots/[id] - 特定のスナップショットを取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const snapshot = await prisma.mandalartSnapshot.findUnique({
      where: { id },
      include: {
        mandalart: true,
      },
    });

    if (!snapshot) {
      return NextResponse.json(
        { error: 'Snapshot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error('Error fetching snapshot:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snapshot' },
      { status: 500 }
    );
  }
}

// DELETE /api/snapshots/[id] - スナップショットを削除（通常は使用しない）
// 要件定義では「スナップショットは削除不可（履歴の保全）」となっているが、
// 緊急時のために実装を提供
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    if (!force) {
      return NextResponse.json(
        {
          error:
            'Snapshot deletion is not recommended. Use ?force=true to confirm.',
        },
        { status: 400 }
      );
    }

    const snapshot = await prisma.mandalartSnapshot.findUnique({
      where: { id },
    });

    if (!snapshot) {
      return NextResponse.json(
        { error: 'Snapshot not found' },
        { status: 404 }
      );
    }

    await prisma.mandalartSnapshot.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Snapshot deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting snapshot:', error);
    return NextResponse.json(
      { error: 'Failed to delete snapshot' },
      { status: 500 }
    );
  }
}
