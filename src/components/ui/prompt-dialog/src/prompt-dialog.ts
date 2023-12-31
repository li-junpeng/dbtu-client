import type { FormItemRule } from 'element-plus'

export interface PromptDialogProp {
  /**
   * 对话框标题
   *
   * @default '请输入内容'
   */
  title?: string

  /**
   * 对话框宽度
   *
   * @default '500px'
   */
  width?: string

  /**
   * 输入框左侧显示的文本
   *
   * @default '名称'
   */
  label?: string

  /**
   * el-input的prop
   *
   * @default {}
   */
  inputProp?: Record<string, any>

  /**
   * 输入框验证规则
   *
   * @default []
   */
  validateRule?: FormItemRule | FormItemRule[]

  /**
   * 关闭后的回调函数
   *
   * @returns void
   */
  afterCancel?: () => void

  /**
   * 点击保存按钮时的回调函数
   *
   * @param value input输入框的值
   * @returns Promise
   *
   * - 返回Promise.resolve(message), 关闭对话框，并调用MessageBox.me
   * - 返回Promise.reject(message), 不关闭对话框, 并调用MessageBox.error(message)打印错误内容
   */
  confirm: (value: string) => Promise<string | void>

  /**
   * 确定按钮文本
   * 
   * @default '保存'
   */
  confirmText?: string

  /**
   * 确定按钮loading状态时的文本
   * 
   * @default '正在保存'
   */
  confirmLoadingText?: string
}
