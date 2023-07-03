/**
 * 数据库标识
 */
type DatabaseIdent =
  | 'mysql'
  | 'sql_server_2012'
 /* | 'oracle'
  | 'postgre_sql'
  | 'dm'
  | 'mongodb'
  | 'hive'*/

/**
 * 数据库连接状态, | 正在连接 | 已连接 | 未连接
 */
type ConnectionStatusType =
  | 'connecting'
  | 'connected'
  | 'no_connection'

/**
 * 数据库基本信息
 */
type DatabaseDefine = Record<DatabaseIdent, {
  // 标识
  key: DatabaseIdent
  // 显示名
  name: string,
  // 开发完成了
  used: boolean
}>

/**
 * 连接管理中，筛选连接列表需要的参数
 */
interface ConnectionListSearchParams {
  // 数据库类型
  dbType: 'all' | DatabaseTypes
  // 连接名称
  name?: string
}

/**
 * 数据库连接信息
 */
interface ConnectionInfo extends BaseEntity {
  // 主键
  id: number | null
  // 连接名
  name: string
  // 数据库类型
  dbType: DatabaseIdent
  // 状态
  status: ConnectionStatusType
  // 主机
  host?: string
  // 端口, 范围 0 ~ 65535
  port?: number
  // 连接详情, 每个数据库跟每个数据库的信息都不一样
  detail:
    | MySQLConnectionInfo
    | SQLServer2012ConnectionInfo
}

/**
 * MySQL数据库连接详情信息
 */
interface MySQLConnectionInfo {
  // 服务器版本
  version?: string
  // 会话数
  sessionNum: number
  // 用户名
  username?: string
  // 密码
  password?: string
}

/**
 * SQL Server 2012 数据库连接详情信息
 */
interface SQLServer2012ConnectionInfo {
  // 服务器版本
  version?: string
  // 会话数
  sessionNum: number
  // 用户名
  username?: string
  // 密码
  password?: string
}