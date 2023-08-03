export interface TableIndexProp {

  /**
   * 表字段
   */
  tableFields: MySqlTableField[]
}

export const TableIndexPropDefault: Record<keyof TableIndexProp, any> = {
  tableFields: []
}
