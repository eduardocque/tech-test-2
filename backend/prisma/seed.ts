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
      },
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'pass123',
        firstName: 'John',
        lastName: 'Doe',
        status: 'active',
        loginCounter: 0
      },
      {
        username: 'maria88',
        email: 'maria@example.com',
        password: 'maria123',
        firstName: 'Maria',
        lastName: 'Lopez',
        status: 'inactive',
        loginCounter: 0
      },
      {
        username: 'peterp',
        email: 'peter@example.com',
        password: 'peter456',
        firstName: 'Peter',
        lastName: 'Parker',
        status: 'active',
        loginCounter: 0
      },
      {
        username: 'linda_s',
        email: 'linda@example.com',
        password: 'linda789',
        firstName: 'Linda',
        lastName: 'Smith',
        status: 'active',
        loginCounter: 0
      },
      {
        username: 'carlos_r',
        email: 'carlos@example.com',
        password: 'carlos123',
        firstName: 'Carlos',
        lastName: 'Rodriguez',
        status: 'inactive',
        loginCounter: 0
      },
      {
        username: 'emma_w',
        email: 'emma@example.com',
        password: 'emma456',
        firstName: 'Emma',
        lastName: 'Watson',
        status: 'active',
        loginCounter: 0
      },
      {
        username: 'david_b',
        email: 'david@example.com',
        password: 'david789',
        firstName: 'David',
        lastName: 'Brown',
        status: 'active',
        loginCounter: 0
      },
      {
        username: 'sophia_k',
        email: 'sophia@example.com',
        password: 'sophia123',
        firstName: 'Sophia',
        lastName: 'King',
        status: 'inactive',
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
