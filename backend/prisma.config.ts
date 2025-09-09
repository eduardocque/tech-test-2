import path from 'path';
import 'dotenv/config'; // carga .env automáticamente

import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
    seed: 'npx tsx --env-file=.env prisma/seed.ts'
  }
});
