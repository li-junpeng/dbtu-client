import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// @ts-ignore element-plus 自动导入组件样式
import ElementPlus from 'unplugin-element-plus/vite'

// monaco-editor
import MonacoEditorPlugin from 'vite-plugin-monaco-editor'

// auto import component
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 自定义unplugin-vue-component规则
const UnpluginVueComponentResolver = {

  /**
   * 自动导入src/icons/svg/**.vue, 使用：在文件名前加DIcon + 文件名改为驼峰命名
   *
   * DIcon = DbtuIcon
   *
   * @example
   * // 使用src/icons/svg/app-github.vue时，如下
   * <el-icon>
   *    <DIconAppGithub/>
   * </el-icon>
   *
   * @param componentName
   * @constructor
   */
  CustomSvgIcon: (componentName: string) => {
    if (componentName.startsWith('DIcon')) {
      const componentPath = `src/icons/svg/${kebabCase2Line(componentName.slice(5))}.vue`
      return fileURLToPath(new URL(componentPath, import.meta.url)).replaceAll('\\', '/')
    }
  },

  ElementPlusIconsVue: (componentName: string) => {
    if (componentName.startsWith('Icon')) {
      return {
        name: componentName.slice(4),
        from: '@element-plus/icons-vue'
      }
    }
  }
}

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
    AutoImport({
      imports: ['vue'],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dts: true,
      resolvers: [
        ElementPlusResolver(),
        UnpluginVueComponentResolver.CustomSvgIcon,
        UnpluginVueComponentResolver.ElementPlusIconsVue
      ],
      // 默认为自动导入src/components下的组件, 现在排除, 自己创建的组件不需要自动导入
      globs: []
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

const kebabCase2Line = (str: string): string => {
  let s = str.replace(/[A-Z]/g, item => {
    return '-' + item.toLowerCase()
  })
  if (s.startsWith('-')) {
    s = s.slice(1)
  }
  return s
}
