// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.js'],
    deps: {
      optimizer: {
        web: {
          include: [
            'html-encoding-sniffer',
            '@exodus/bytes',
          ],
        },
      },
      interopDefault: true, // Keep this as it helps with default exports
    },
  },
});