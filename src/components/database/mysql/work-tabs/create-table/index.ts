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
