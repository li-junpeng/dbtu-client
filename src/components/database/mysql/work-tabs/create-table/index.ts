import { MySQLDataType } from '@/common/constants/DataTypeConstant'

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
  dataType: keyof typeof MySQLDataType
  maxLength?: number
  decimalPoint: number
  notNull: 1 | 0
  virtual: 1 | 0
  pk: boolean
  comment?: string
  options: Record<string, any>
}
