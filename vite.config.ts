import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';
import sass from 'sass';

export default defineConfig({
  base: './',
  build: {
    sourcemap: true,
  },
  plugins: [
    vue(),
    VueSetupExtend(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  css: {
    preprocessorOptions: {
      sass: {
        implementation: sass,
      },
    },
  },
  optimizeDeps: {
    include: ['schart.js'],
  },
  resolve: {
    alias: {
      '@api': resolve(__dirname, 'src/api'),
      '@views': resolve(__dirname, 'src/views'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@components': resolve(__dirname, 'src/components'),
      '@constant': resolve(__dirname, 'src/constant'),
      '@store': resolve(__dirname, 'src/store'),
    },
  },
  server: {
    // 开启热更新
    hmr: true,
    proxy: {
      '/api/admin': {
        // target: 'https://zjkdongao.com',
        target: 'http://127.0.0.1:7002',
        changeOrigin: true,
      },
    },
  },
});
