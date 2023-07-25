import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// @ts-ignore element-plus 自动导入组件样式
import ElementPlus from 'unplugin-element-plus/vite'

// monaco-editor
import MonacoEditorPlugin from 'vite-plugin-monaco-editor'

export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true
      }
    }),
    ElementPlus({
      useSource: true,
      // Do not include the prefix in the name.
      // example: ElAutoResizer = AutoResizer, Because the character `el` is configurable
      ignoreComponents: ['AutoResizer']
    }),
    MonacoEditorPlugin({})
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/css-style/element-plus.scss" as *;`,
      },
    },
  },
})
