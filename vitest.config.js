// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.js'],
    deps: {
      inline: [
        'html-encoding-sniffer',
        '@exodus/bytes',
      ],
      interopDefault: true,
    },
  },
});