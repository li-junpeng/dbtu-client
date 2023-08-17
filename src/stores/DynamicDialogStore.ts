import { type Ref, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import type { DialogProps } from 'element-plus'
import { loadAsyncComponent } from '@/common/utils/AsyncLoadComponent'

type DialogOption = Partial<
  {
    props?: Record<string, any>,
    footerButtons?: FooterButton[]
    afterOpen?: (ref: Ref) => void
  } & DialogProps
>

export interface FooterButton {
  type: 'info' | 'danger' | 'primary' | 'warning'
  text: string
  enableLoading?: boolean
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  onClick: () => Promise<void>
}

export const useDynamicDialogStore = defineStore('useDynamicDialogStore', {
  state: () => {
    return {
      // vue ref
      ref: ref(),
      // Dialog 对话框 Dialog 的标题
      title: '',
      // 是否显示 Dialog
      visible: false,
      // Dialog 的宽度
      width: 400 as number | string,
      // Dialog 的内容
      component: shallowRef(),
      // Dialog 自身是否插入至 body 元素上。 嵌套的 Dialog 必须指定该属性并赋值为 true
      appendToBody: false,
      // 遮罩的自定义类名
      modalClass: '',
      // 底部按钮
      footerButtons: [] as FooterButton[],
      // prop
      props: {}
    }
  },

  actions: {
    open(option: DialogOption, component: () => Promise<{}>): void {
      this.ref = null
      this.title = option.title || '新建对话框'
      this.width = option.width || 400
      this.appendToBody = option.appendToBody || false
      this.modalClass = option.modalClass || ''
      this.footerButtons = option.footerButtons || []
      this.component = loadAsyncComponent(component)
      this.visible = true
      this.props = option.props || {}
      // 防止组件加载成功后this.ref值为空
      const intervalId = setInterval(() => {
        if (this.ref) {
          clearInterval(intervalId)
          option.afterOpen?.(this.ref)
        }
      }, 10)
    },

    close() {
      this.visible = false
    }
  }
})
