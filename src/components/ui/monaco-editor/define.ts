export interface MonacoEditorProp {
  /**
   * 只读模式
   *
   * @default false
   */
  readonly?: boolean
  /**
   * 语言
   *
   * @default sql
   */
  language?: 'sql' | 'javascript' | 'html' | 'java'
  /**
   * 代码折叠
   *
   * @default false
   */
  folding?: boolean
  /**
   * 显示行号
   *
   * @description
   * 控制行号的渲染。如果它是一个函数，则在呈现行号时会调用它，并呈现返回值。否则，如果是truthy，行
   * 号将正常呈现（相当于使用恒等函数）。否则，将不会渲染行号。默认为启用。
   *
   * @default 'on'
   */
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval' | ((lineNumber: number) => string)
  /**
   * 自动换行
   *
   * @default 'off'
   */
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded'
}

export const MonacoEditorPropDefault: Record<keyof MonacoEditorProp, any> = {
  readonly: false,
  language: 'sql',
  folding: false,
  lineNumbers: 'on',
  wordWrap: 'off'
}

export interface MonacoEditorEmits {
  /**
   * 当编辑器的内容改变时
   *
   * @param e     event name
   * @param text  编辑器的内容
   */
  (e: 'change-text', text: string): void

  /**
   * 编辑器失去焦点事件
   *
   * @param e event name
   */
  (e: 'editor-blur'): void
}
