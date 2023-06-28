type DatabaseTypeKey =
  | 'mysql'
  | 'oracle'
  | 'postgre_sql'
  | 'dm'
  | 'sql_server_2012'
  | 'mongodb'
  | 'hive'

type DatabaseDefine = Record<DatabaseTypeKey, {
  // 标识
  key: DatabaseTypeKey
  // 显示名
  name: string,
  // 开发完成了
  used: boolean
}>

interface ConnectionListSearchParams {
  // 数据库类型
  dbType: 'all' | DatabaseTypes
  // 连接名称
  name?: string
}
