

export type TableColumn = {
  /**
   * 字段的key
   */
  key: string

  /**
   * 字段的名称
   */
  label: string

  /**
   * 数据类型
   */
  dataType: DbDataType

}

export interface DataGridProp {
  /**
   * 表的列
   */
  columns: TableColumn[]

  /**
   * 表格数据
   */
  data: any[]

  /**
   * 是否显示序号列
   *
   * @default true
   */
  indexColumn?: boolean

  /**
   * 序号列的标题
   *
   * @default ''
   */
  indexColumnTitle?: string

  /**
   * 是否自动添加无数据时的空行
   *
   * @default true
   */
  appendNoneData?: boolean

  /**
   * 无数据时空行中的列默认显示的值
   *
   * @default (N/A)
   */
  noneDataValue?: string
}