export interface EditTablePopoverSlots {
  reference(props: { open: () => void }): void
}

export interface EditTablePopoverProps {
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
   * @default 'top'
   */
  placement: 'top' | 'bottom' | 'left' | 'right'
}

export const EditTablePopoverPropDefaults: EditTablePopoverProps = {
  width: 600,
  height: 400,
  placement: 'top'
}