import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'src/test/**',
        '**/*.test.js',
        '**/*.config.js',
        'vite.config.js',
        'vitest.config.js',
        'src/assets/**',
        'dist/**'
      ],
      include: [
        'src/**/*.js'
      ],
      // Coverage thresholds (optional)
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
