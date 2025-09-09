import path from 'path';

import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('db', 'migrations'),
    seed: 'npx tsx --env-file=.env prisma/seed.ts'
  }
});
