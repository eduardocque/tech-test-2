/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.createMany({
    data: [
      {
        username: 'tester',
        email: 'tester@example.com',
        password: '1234',
        firstName: 'Tester',
        lastName: 'Good',
        status: 'active',
        loginCounter: 0
      },
      {
        username: 'ana123',
        email: 'ana@example.com',
        password: 'abcd',
        firstName: 'Ana',
        lastName: 'Silva',
        status: 'active',
        loginCounter: 0
      }
    ],
    skipDuplicates: true
  });

  console.log('Seed completado ✅');
}

seed()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
