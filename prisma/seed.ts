import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Supabase connection pooling用のアダプター
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  // 既存のデータを削除（開発環境のみ）
  await prisma.task.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.mandalartSnapshot.deleteMany();
  await prisma.mandalart.deleteMany();
  await prisma.user.deleteMany();

  // ユーザーを作成
  const user = await prisma.user.create({
    data: {
      id: 'user-1',
      email: 'test@example.com',
      name: 'テストユーザー',
    },
  });

  console.log('Created user:', user.id);

  // マンダラートを作成
  const mandalart = await prisma.mandalart.create({
    data: {
      userId: user.id,
      mainGoal: '健康的な生活を送る',
      status: 'ACTIVE',
      goals: {
        create: [
          {
            title: '運動習慣をつける',
            position: 1,
            tasks: {
              create: [
                {
                  title: 'ジムに行く',
                  currentCount: 3,
                  targetCount: 7,
                  targetUnit: '回/週',
                  position: 1,
                },
                {
                  title: 'ランニング',
                  currentCount: 2,
                  targetCount: 5,
                  targetUnit: '回/週',
                  position: 2,
                },
                {
                  title: 'ストレッチ',
                  currentCount: 5,
                  targetCount: 7,
                  targetUnit: '回/週',
                  position: 3,
                },
                {
                  title: 'ヨガ',
                  currentCount: 1,
                  targetCount: 3,
                  targetUnit: '回/週',
                  position: 4,
                },
                {
                  title: '筋トレ',
                  currentCount: 4,
                  targetCount: 5,
                  targetUnit: '回/週',
                  position: 5,
                },
                {
                  title: 'ウォーキング',
                  currentCount: 6,
                  targetCount: 7,
                  targetUnit: '回/週',
                  position: 6,
                },
                {
                  title: '水泳',
                  currentCount: 0,
                  targetCount: 2,
                  targetUnit: '回/週',
                  position: 7,
                },
                {
                  title: 'サイクリング',
                  currentCount: 1,
                  targetCount: 2,
                  targetUnit: '回/週',
                  position: 8,
                },
              ],
            },
          },
          {
            title: '食生活を改善する',
            position: 2,
            tasks: {
              create: Array.from({ length: 8 }, (_, i) => ({
                title: `食事タスク${i + 1}`,
                currentCount: i % 3,
                targetCount: 7,
                targetUnit: '回/週',
                position: i + 1,
              })),
            },
          },
          {
            title: '睡眠の質を上げる',
            position: 3,
            tasks: {
              create: Array.from({ length: 8 }, (_, i) => ({
                title: `睡眠タスク${i + 1}`,
                currentCount: i % 4,
                targetCount: 7,
                targetUnit: '回/週',
                position: i + 1,
              })),
            },
          },
          ...Array.from({ length: 5 }, (_, goalIndex) => {
            const position = goalIndex + 4;
            return {
              title: `目標${position}`,
              position,
              tasks: {
                create: Array.from({ length: 8 }, (_, taskIndex) => ({
                  title: `タスク${taskIndex + 1}`,
                  currentCount: taskIndex % 5,
                  targetCount: 7,
                  targetUnit: '回/週',
                  position: taskIndex + 1,
                })),
              },
            };
          }),
        ],
      },
    },
    include: {
      goals: {
        include: {
          tasks: true,
        },
      },
    },
  });

  console.log('Created mandalart:', mandalart.id);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
