export interface SetEnumValuesPopoverProp {
  /**
   * popover的宽度
   * 
   * @default 600
   */
  width?: number

  /**
   * popover内容的高度
   * 
   * @default 300
   */
  height?: number
}

export const SetEnumValuesPopoverPropDefault: Record<keyof SetEnumValuesPopoverProp, any> = {
  width: 600,
  height: 300
}

export interface TableItem {
  id: number
  enum: string
}

export interface ComponentEmits {
  (e: 'change-enums', data: {
    enums: TableItem[],
    text: string
  }): void
}