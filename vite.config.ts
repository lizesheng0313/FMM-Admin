/*
 * @Author: lizesheng
 * @Date: 2023-02-22 16:41:23
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-05-06 14:36:31
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/vite.config.ts
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
import sass from 'sass'

export default defineConfig({
  base: './',
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
    },
  },
  server: {
    // 开启热更新
    hmr: true,
    proxy: {
      '/api': {
        // target: 'https://zjkdongao.com/qq',
        target: 'http://127.0.0.1:7002',
        changeOrigin: true,
      },
    },
  },
})
