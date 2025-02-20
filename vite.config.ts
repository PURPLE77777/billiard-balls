import path from 'path';
import { defineConfig } from 'vite';

const composeAbsolutePath = (dir: string) => path.resolve(__dirname, dir);

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  base: './',
  resolve: {
    alias: {
      share: composeAbsolutePath('src/share'),
      figures: composeAbsolutePath('src/figures'),
      entities: composeAbsolutePath('src/entities'),
      containers: composeAbsolutePath('src/containers'),
    },
  },
  server: {
    // open: true,
  },
});
