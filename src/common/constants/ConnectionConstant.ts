export const DatabaseTypes: DatabaseDefine = {
  mysql: {
    key: 'mysql',
    name: 'MySQL',
    used: true
  },
  sql_server_2012: {
    key: 'sql_server_2012',
    name: 'SQL Server 2012',
    used: true
  },
  /*oracle: {
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
  }*/
}

/**
 * 数据库连接状态
 */
export const ConnectionStatus: Record<ConnectionStatusType, string> = {
  connecting: '正在连接',
  connected: '已连接',
  no_connection: '未连接'
}

/**
 * 认证方式
 */
export const AuthenticationTypes: ElSelectOption<AuthenticationTypeKey>[] = [
  {
    value: 'user_password',
    label: '用户 & 密码'
  },
  {
    value: 'none',
    label: '无认证'
  }
]

/**
 * 保存密码的方式
 */
export const SavePasswordTypes: ElSelectOption<SavePasswordTypeKey>[] = [
  {
    value: 'never',
    label: '从不保存'
  },
  {
    value: 'for_session',
    label: '本次会话'
  },
  {
    value: 'forever',
    label: '永久保存'
  }
]
