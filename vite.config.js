import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'EnhancedSimpleTable',
      formats: ['es', 'cjs', 'iife'],
      fileName: (format) => {
        if (format === 'es') return 'enhanced-simple-table.esm.js';
        if (format === 'cjs') return 'enhanced-simple-table.js';
        if (format === 'iife') return 'enhanced-simple-table.min.js';
        return `enhanced-simple-table.${format}.js`;
      }
    },
    outDir: 'dist',
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        exports: 'named' // <--- Add this line to silence the warning
      }
    }
  }
});