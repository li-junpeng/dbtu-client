import type { Ref } from 'vue'

import type { TableColumnCtx } from 'element-plus/es/components'

export type TableColumn = TableColumnCtx<unknown>
export type TableRowItem = any

export interface EditableTableSlots {
  // 动态插槽, 插槽名: #column-${column.prop}
  [key: string]: (props: {
    /**
     * 行数据
     */
    row: TableRowItem

    /**
     * 自定义的列信息, `props.columns`
     */
    column: TableColumnOption

    /**
     * 目前已经选中的行的数据, 注意: 值可能会为null
     */
    currentRow: TableRowItem

    /**
     * 目前选中的单元格
     */
    currentColumn: TableColumn | null

    /**
     * 判断是否需要展示表单组件
     *
     * @param component 组件标识
     * @returns true: 需要展示, false: 不需要展示
     */
    isShowComponent: (component: TableColumnComponentType) => boolean
  }) => void
}

export type TableColumnComponentType = 'text' | 'input' | 'input-number' | 'checkbox' | 'switch' | 'select'

/**
 * el-table-column 属性
 */
export interface TableColumnOption {
  /**
   * el-table-column of label
   */
  label: string

  /**
   * el-table-column of prop
   */
  prop: string

  /**
   * 列宽
   *
   * @default 自适应
   */
  width?: string | number

  /**
   * 单元格需要以什么组件来编辑值
   *
   * - text: 纯文本展示
   * - slot: 自定义插槽, 插槽名为prop
   */
  component: TableColumnComponentType

  /**
   * 组件的原始prop
   *
   * @example
   * // 如果 component = 'input', 那么这里就可以使用el-input的prop了
   * componentProp: {
   *    maxlength: 100,
   *    clearable: true
   * }
   */
  componentProp?: Record<string, any>

  /**
   * 是否自定义插槽, 插槽名称为 `column-${prop}`
   *
   * @default false
   */
  useSlot?: boolean

  /**
   * 自定义插槽内的表单组件ref, 主要目的是当点击了自定义插槽列, 能使其表单组件自动获取焦点(表单组件必须要有focus()函数)
   */
  slotRef?: Ref<any>

  /**
   * 单元格对齐方式
   */

  align?: 'left' | 'right' | 'center'

  /**
   * checkbox属性, 当`component = 'checkbox'`时必填
   */
  checkbox?: {
    // 选中时的值
    trueValue: number | string
    // 未选中时的值, 默认为空字符串
    falseValue?: number | string
  }

  /**
   * switch属性, 当`component = 'switch'`时必填
   */
  switch?: {
    // 打开时的值, 默认为true
    trueValue?: number | string | boolean
    // 关闭时的值, 默认为false
    falseValue?: number | string | boolean
  }

  /**
   * select属性, 当`component = 'select'`时必填
   */
  select?: {
    // el-option 数据, 如果是普通类型的数组, 则不需要配置valueKey和labelKey
    // 如果是对象数组, 则valueKey和labelKey必须要配置
    options: any[]
    valueKey?: string
    labelKey?: string
    clearable?: boolean
    filterable?: boolean
    placeholder?: string
  }
}

export interface EditableTableProps {
  /**
   * 数据项的key, 用来标识哪个字段是唯一值
   */
  rowKey: string

  /**
   * 表格列, 也可以通过插槽#columns自定义
   */
  columns: TableColumnOption[]

  /**
   * 是否显示序号列
   *
   * @default true
   */
  indexColumn?: boolean
}

export const EditableTablePropDefaults: Partial<EditableTableProps> = {
  indexColumn: true
}
