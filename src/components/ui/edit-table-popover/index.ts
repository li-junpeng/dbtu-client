import type { TableColumnOption, EditableTableSlots } from '@/components/ui/editable-table'

export interface EditTablePopoverSlots extends EditableTableSlots {
  /**
   * 与 el-popover 的reference插槽一样
   */
  reference(): void
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

  /**
   * 添加按钮文字
   *
   * @default 添加项
   */
  addButtonText?: string

  /**
   * 删除按钮文字
   *
   * @default 删除项
   */
  deleteButtonText?: string

  /**
   * 上移按钮文字
   *
   * @default 上移
   */
  moveUpButtonText?: string

  /**
   * 下移按钮文字
   *
   * @default 下移
   */
  moveDownButtonText?: string
}

export const EditTablePopoverPropDefaults: Partial<EditTablePopoverProps> = {
  width: 600,
  height: 400,
  addButtonText: '添加项',
  deleteButtonText: '删除项',
  moveUpButtonText: '上移',
  moveDownButtonText: '下移'
}
