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
  }
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

export const InjectionKey = {
  // 打开创建分组对话框
  openCreateGroup: Symbol(),
  // 打开创建连接对话框
  openCreateConnection: Symbol()
}

/**
 * 数据库驱动
 */
export const DatabaseDrivers: Partial<Record<DatabaseIdent, DatabaseDriverElOption<string>[]>> = {
  mysql: [
    {
      value: 'mysql',
      label: 'MySQL',
      flag: 'mysql'
    },
    {
      value: 'mysql_5.1',
      label: 'MySQL for 5.1',
      flag: 'mysql'
    },
    {
      value: 'mariadb',
      label: 'MariaDB',
      flag: 'mariadb'
    }
  ] as DatabaseDriverElOption<MySQLDriverKey>[]
}

/**
 * 获取数据库驱动详情
 *
 * @param db      数据库标识
 * @param driver  驱动标识
 */
export const getDatabaseDriverInfo = <T>(
  db: DatabaseIdent,
  driver: T
): DatabaseDriverElOption<T> | null => {
  const drivers = DatabaseDrivers[db] as DatabaseDriverElOption<T>[]
  for (let i = 0; i < drivers.length; i++) {
    if (drivers[i].value === driver) {
      return drivers[i]
    }
  }
  return null
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
 * 连接类型
 */
export const ConnectionTypes: ElSelectOption<ConnectionTypeKey>[] = [
  {
    value: 'default',
    label: '默认'
  },
  {
    value: 'only_url',
    label: '仅 URL'
  }
]

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
    label: '无身份验证'
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

/**
 * 编码方式
 */
export const CharsetTypes: ElSelectOption<string>[] = [
  {
    value: 'auto',
    label: '自动'
  },
  {
    value: 'us_ascii',
    label: 'US-ASCII'
  },
  {
    value: 'iso_6937',
    label: 'ISO 6937 Non-Spacing Accent'
  },
  {
    value: 'utf7',
    label: 'UTF - 7'
  },
  {
    value: 'utf8',
    label: 'UTF - 8'
  },
  {
    value: 'gbk',
    label: 'GBK'
  }
]

/**
 * 条件
 */
export const JudgeConditions: Record<string, string> = {
  equal: '=',
  not_equal: '!=',
  less: '<',
  less_equal: '<=',
  greater: '>',
  greater_equal: '>=',
  like: '包含',
  not_link: '不包含',
  begin_like: '开始以',
  not_begin_like: '开始不是以',
  end_link: '结束以',
  noe_end_link: '结束不是以',
  is_null: '是 null',
  not_is_null: '不是 null',
  is_blank: '是空的',
  not_is_blank: '不是空的',
  between: '介于',
  noe_between: '不介于',
  in: '在列表',
  not_in: '不在列表'
}
