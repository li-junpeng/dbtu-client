export const DatabaseTypes: DatabaseDefine = {
  mysql: {
    key: 'mysql',
    name: 'MySQL',
    used: true
  },
  oracle: {
    key: 'oracle',
    name: 'Oracle',
    used: false
  },
  hive: {
    key: 'hive',
    name: 'Hive',
    used: false
  },
  dm: {
    key: 'dm',
    name: '达梦',
    used: false
  },
  mongodb: {
    key: 'mongodb',
    name: 'MongoDB',
    used: false
  },
  postgre_sql: {
    key: 'postgre_sql',
    name: 'PostgreSQL',
    used: false
  },
  sql_server_2012: {
    key: 'sql_server_2012',
    name: 'SQL Server 2012',
    used: false
  }
}

/**
 * 数据库连接状态
 */
export const ConnectionStatus: Record<ConnectionStatusType, string> = {
  connecting: '正在连接',
  connected: '已连接',
  no_connection: '未连接'
}
