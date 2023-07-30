export interface CreateTableProp {
  data: {
    database: MySqlDatabaseNode
  }
}

export const TabNames = {
  field: 'field',
  index: 'index',
  fk: 'fk',
  trigger: 'trigger',
  option: 'option',
  comment: 'comment',
  sql_preview: 'sql_preview'
}

export interface TableField {
  id: number
  field: string
  dataType: string
  maxLength?: number
  decimalPoint?: number
  notNull: 1 | 0
  virtual: 1 | 0
  fk?: number
  comment?: string
}
