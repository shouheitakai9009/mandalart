import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

// POST /api/mandalarts/[id]/complete - マンダラートを完了する
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingMandalart = await prisma.mandalart.findUnique({
      where: { id: params.id },
    });

    if (!existingMandalart) {
      return NextResponse.json(
        { error: 'Mandalart not found' },
        { status: 404 }
      );
    }

    if (existingMandalart.deletedAt) {
      return NextResponse.json(
        { error: 'Cannot complete deleted mandalart' },
        { status: 400 }
      );
    }

    if (existingMandalart.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Mandalart is already completed' },
        { status: 400 }
      );
    }

    const mandalart = await prisma.mandalart.update({
      where: { id: params.id },
      data: {
        status: 'COMPLETED',
        endDate: new Date(),
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

    return NextResponse.json({
      success: true,
      message: 'Mandalart completed successfully',
      data: mandalart,
    });
  } catch (error) {
    console.error('Error completing mandalart:', error);
    return NextResponse.json(
      { error: 'Failed to complete mandalart' },
      { status: 500 }
    );
  }
}
