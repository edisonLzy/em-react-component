import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  root: path.join(process.cwd(), './website'),
  plugins: [reactRefresh()],
  resolve: {
    // extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
