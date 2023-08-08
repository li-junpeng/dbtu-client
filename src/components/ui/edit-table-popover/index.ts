import type { TableColumnCtx } from "element-plus"

export type TableColumn = TableColumnCtx<unknown>
export type TableRowItem = any

export interface EditTablePopoverSlots {
  // 与 el-popover 的reference插槽一样
  reference(): void,

  // 动态插槽, 插槽名: #column-${column.prop}
  [key: string]: (row: TableRowItem, column: TableColumnOption, currentRow: TableRowItem, currentColumn: TableColumn) => void
}

export type TableColumnComponentType = 'text' | 'slot' | 'input' | 'input-number' | 'checkbox' | 'switch' | 'select'

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
    options: any[],
    valueKey?: string,
    labelKey?: string,
    clearable?: boolean
    filterable?: boolean
    placeholder?: string
  }
}

export interface EditTablePopoverProps {

  /**
   * 数据项的key, 用来标识哪个字段是唯一值
   */
  rowKey: string

  /**
   * [添加项]按钮的回调函数, 请自定义添加项的业务代码
   * 
   * @returns 返回需要添加的数据
   * 
   * @example
   * 
   * <script setup lang="ts">
   * const fields = [
   *    {
   *      id: 1,
   *      field: 'name,
   *    }
   * ]
   * 
   * const addItem = () => {
   *    return {
   *      id: 2,
   *      field: 'username'
   *    }
   * }
   * </script>
   * 
   * <template>
   *    <EditTablePopover v-model="fields" :add-item="addItem"></EditTablePopover>
   * </template>
   */
  addItem: () => any

  /**
   * 表格列, 也可以通过插槽#columns自定义
   */
  columns: TableColumnOption[]

  /**
   * el-popover的宽度, 单位: px
   * 
   * @default 600
   */
  width?: number

  /**
   * el-popover的高度, 单位: px
   * 
   * @default 400
   */
  height?: number

  /**
   * el-popover placement
   * 
   * @default undefined
   */
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

export const EditTablePopoverPropDefaults: Partial<EditTablePopoverProps> = {
  width: 600,
  height: 400
}