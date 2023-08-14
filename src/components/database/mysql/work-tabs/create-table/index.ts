export const DATABASE_PROVIDE_KEY = Symbol()

export interface CreateTableProp {
  data: {
    database: MySqlDatabaseInstance
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
