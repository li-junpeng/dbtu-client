export interface DataSortDrawerProp {
  /**
   * drawer title
   *
   * @default 数据排序
   */
  title?: string
  /**
   * el-drawer append-to-body
   *
   * @default false
   */
  appendToBody?: boolean
  /**
   * 排序字段
   *
   * @default []
   */
  fields: string[]
}

export const DataSortDrawerPropDefault: Record<keyof DataSortDrawerProp, any> = {
  title: '数据排序',
  appendToBody: false,
  fields: []
}

export interface DataSortItem {
  key: number
  field: string
  rule: 'ASC' | 'DESC'
  // 1 = true, 0 = false
  use: 1 | 0
}
