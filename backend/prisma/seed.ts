/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.createMany({
    data: [
      {
        username: 'tester',
        email: 'tester@example.com',
        password: await bcrypt.hash('1234', 10),
        firstName: 'Tester',
        lastName: 'Good',
        status: 'active',
        loginCounter: 0
      },
      {
        username: 'ana123',
        email: 'ana@example.com',
        password: await bcrypt.hash('abcd', 10),
        firstName: 'Ana',
        lastName: 'Silva',
        status: 'active',
        loginCounter: 0
      },
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: await bcrypt.hash('pass123', 10),
        firstName: 'John',
        lastName: 'Doe',
        status: 'active',
        loginCounter: 0
      },
      {
        username: 'maria88',
        email: 'maria@example.com',
        password: await bcrypt.hash('maria123', 10),
        firstName: 'Maria',
        lastName: 'Lopez',
        status: 'inactive',
        loginCounter: 0
      },
      {
        username: 'peterp',
        email: 'peter@example.com',
        password: await bcrypt.hash('peter456', 10),
        firstName: 'Peter',
        lastName: 'Parker',
        status: 'active',
        loginCounter: 0
      },
      {
        username: 'linda_s',
        email: 'linda@example.com',
        password: await bcrypt.hash('linda789', 10),
        firstName: 'Linda',
        lastName: 'Smith',
        status: 'active',
        loginCounter: 0
      },
      {
        username: 'tester2',
        email: 'tester2@example.com',
        password: await bcrypt.hash('1234', 10),
        firstName: 'a',
        lastName: 'b',
        status: 'inactive',
        loginCounter: 0
      },
      {
        username: 'emma_w',
        email: 'emma@example.com',
        password: await bcrypt.hash('emma456', 10),
        firstName: 'Emma',
        lastName: 'Watson',
        status: 'active',
        loginCounter: 0
      },
      {
        username: 'david_b',
        email: 'david@example.com',
        password: await bcrypt.hash('david789', 10),
        firstName: 'David',
        lastName: 'Brown',
        status: 'active',
        loginCounter: 0
      },
      {
        username: 'sophia_k',
        email: 'sophia@example.com',
        password: await bcrypt.hash('sophia123', 10),
        firstName: 'Sophia',
        lastName: 'King',
        status: 'inactive',
        loginCounter: 0
      }
    ],
    skipDuplicates: true
  });

  console.log('Seed completed ✅');
}

seed()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
