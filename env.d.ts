/// <reference types="vite/client" />

// 在ts文件中使用vue不报错
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const vueComponent: DefineComponent<{}, {}, any>
  export default vueComponent
}
