/* eslint-disable quotes */
import bcrypt from 'bcryptjs';
import cors from 'cors';
import express from 'express';
import omit from 'lodash/omit.js';

import prisma from './database.ts';

import type { User } from './database.ts';

const app = express();
const PORT = process.env.PORT || 8888;

// Setup

app.use(
  cors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // access-control-allow-credentials:true
    optionsSuccessStatus: 200
  })
);

app.use(express.json());

// --- User CRUD --- //

app.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/users', async (req, res) => {
  const { username, email, password, firstName, lastName, status = 'inactive' } = req.body as User;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'firstName y lastName son obligatorios' });
  }

  if (status && !['active', 'inactive'].includes(status)) {
    return res.status(400).json({ error: "Status inválido. Debe ser 'active' o 'inactive'" });
  }

  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        password, // needs to be encrypted
        status,
        username,
        email,
        loginCounter: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    res.status(201).json(user);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
});

app.patch('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, status } = req.body as Partial<User>;
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status === 'inactive' && (firstName || lastName)) {
      return res.status(400).json({ error: 'Inactive users cannot update names' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        status: status || user.status
      }
    });
    res.json(updatedUser);
  } catch (e: unknown) {
    res.status(400).json({ error: (e as Error).message });
  }
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (e: unknown) {
    res.status(400).json({ error: (e as Error).message });
  }
});

// --- Sessions --- //

app.post('/sessions', async (req, res) => {
  if (!req.body) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { userId } = req.body as { userId: string };

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status === 'inactive') {
      return res.status(400).json({ error: 'Inactive users cannot create sessions' });
    }

    // Increment logins
    await prisma.user.update({
      where: { id: Number(userId) },
      data: { loginCounter: { increment: 1 } }
    });

    const session = await prisma.session.create({
      data: { userId: Number(userId), createdAt: new Date() }
    });
    res.status(201).json(session);
  } catch (e: unknown) {
    res.status(400).json({ error: (e as Error).message });
  }
});

app.post('/sessions/:id/terminate', async (req, res) => {
  const { id } = req.params;
  try {
    const session = await prisma.session.update({
      where: { id: Number(id) },
      data: { terminatedAt: new Date() }
    });
    res.json(session);
  } catch (e: unknown) {
    res.status(400).json({ error: (e as Error).message });
  }
});

// Auth Commands

// app.post('/login', async (req, res) => {
//   if (!req.body) {
//     return res.status(404).json({ error: 'Data missing' });
//   }
// });

app.post('/register', async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body as {
    username: string;
    email: string;
    password: string;
    password_repeat: string;
    firstName: string;
    lastName: string;
  };

  if (!username || !email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existing = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
    if (existing) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        status: 'active',
        loginCounter: 0
      }
    });

    // Crear sesión inmediatamente
    const session = await prisma.session.create({ data: { userId: user.id } });

    return res.status(201).json({ user: omit(user, ['password', 'loginCounter']), session });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Extra commands

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
