import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // Every e2e file talks to the same database and truncates it between
    // tests, so running two files at once has them wiping each other's rows
    // mid-request. One file at a time, in one process.
    fileParallelism: false,
    // Booting Nest and connecting to Postgres is slower than the default
    // 5s allows on a cold start.
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
