export interface TableIndexProp {

  /**
   * 表字段
   */
  tableFields: TableColumn[]
}

export const TableIndexPropDefault: Record<keyof TableIndexProp, any> = {
  tableFields: []
}
