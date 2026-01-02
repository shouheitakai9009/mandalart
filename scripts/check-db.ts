import { prisma } from '../libs/prisma';

async function checkDatabase() {
  try {
    console.log('Checking database...\n');

    // ユーザー数を確認
    const userCount = await prisma.user.count();
    console.log(`Users: ${userCount}`);

    // マンダラート数を確認
    const mandalartCount = await prisma.mandalart.count();
    console.log(`Mandalarts: ${mandalartCount}`);

    // マンダラートの詳細を確認
    const mandalarts = await prisma.mandalart.findMany({
      select: {
        id: true,
        mainGoal: true,
        status: true,
        userId: true,
        createdAt: true,
      },
    });

    console.log('\nMandalart details:');
    console.log(JSON.stringify(mandalarts, null, 2));

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error checking database:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkDatabase();
