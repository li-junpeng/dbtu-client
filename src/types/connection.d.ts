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

type ConnectionNodeType =
  | 'connection'        // 连接
  | 'group'             // 分组
  | 'database'          // 数据库
  | 'table'             // 表
  | 'table_instance'    // 表实例
  | 'view'              // 视图
  | 'view_instance'     // 视图实例
  | 'function'          // 函数
  | 'trigger'           // 触发器
  | 'backup'            // 备份
  | 'search'            // 查询

/**
 * 数据库连接状态, | 正在连接 | 已连接 | 未连接
 */
type ConnectionStatusType =
  | 'connecting'
  | 'connected'
  | 'no_connection'

type CommonStatusType =
  | 'disable'
  | 'loading'
  | 'enable'

/**
 * 认证方式的key
 */
type AuthenticationTypeKey = 'user_password' | 'none'

/**
 * 保存密码方式的key
 */
type SavePasswordTypeKey = 'never' | 'until_restart' | 'for_session' | 'forever'

/**
 * 连接类型
 */
type ConnectionTypeKey = 'default' | 'only_url'

/**
 * MySQL驱动
 */
type MySQLDriverKey = 'mysql' | 'mysql_5.1' | 'mariadb'

/**
 * database driver in el-option
 */
interface DatabaseDriverElOption<T> extends ElSelectOption<T> {
  // flag = jdbc:${flag}://${host}:${port}
  flag: string
}

interface DatabaseDefineItem {
  // 标识
  key: DatabaseIdent
  // 显示名
  name: string
  // 开发完成了
  used: boolean
}

/**
 * 数据库基本信息
 */
type DatabaseDefine = Record<DatabaseIdent, DatabaseDefineItem>

interface ConnectionTreeNode {
  // 主键
  id: number | null
  // 连接名
  name: string
  // 节点类型
  nodeType: ConnectionNodeType
  // session id, 除了nodeType = 'group' 和 'connection'，这个值应该为必填项
  sessionId?: number
}

/**
 * 数据库连接信息
 */
interface ConnectionInfo<T extends BaseConnectionDetail> extends ConnectionTreeNode {
  // 分组ID
  groupId?: number,
  // 数据库类型
  dbType: DatabaseIdent
  // 状态
  status: ConnectionStatusType
  // 主机
  host?: string
  // 端口, 范围 0 ~ 65535
  port?: number
  // 连接详情, 每个数据库跟每个数据库的信息都不一样
  detail: T
  // 说明
  comment?: string
  // 子集
  children?: ConnectionTreeNode[]
}

interface ConnectionGroup extends ConnectionTreeNode {
  children?: ConnectionInfo<BaseConnectionDetail>[]
}

interface DatabaseNode extends ConnectionTreeNode {
  status: CommonStatusType
  children?: ConnectionTreeNode[]
}

interface TableNode extends ConnectionTreeNode {
  children?: ConnectionTreeNode[]
}

interface TableInstanceNode extends ConnectionTreeNode {
}

interface ViewNode extends ConnectionTreeNode {
  children?: ConnectionTreeNode[]
}

interface ViewInstanceNode extends ConnectionTreeNode {
}

interface FunctionNode extends ConnectionTreeNode {
  children?: ConnectionTreeNode[]
}

interface SearchNode extends ConnectionTreeNode {
  children?: ConnectionTreeNode[]
}

interface BackupNode extends ConnectionTreeNode {
  children?: ConnectionTreeNode[]
}

interface BaseConnectionDetail {
}

/**
 * MySQL数据库连接详情信息
 */
interface MySQLConnectionInfo extends BaseConnectionDetail {
  // 驱动
  driver: MySQLDriverKey
  // 连接类型
  connectionType: ConnectionTypeKey
  // 服务器版本
  version?: string
  // 会话数
  sessionNum?: number
  // 用户名
  username?: string
  // 密码
  password?: string
  // 认证方式
  authType: AuthenticationTypeKey
  // 保存密码的方式
  savePwdType: SavePasswordTypeKey
  // url
  url?: string,
  // 时区
  timeZone?: string
  // 字符集编码
  charset: string
  // 是否开启保持连接间隔
  connectionInterval: boolean
  // 保持连接间隔时间, 单位: 秒
  connectionIntervalTime?: number
  // 是否开启自动断开功能
  autoBreak: boolean
  // 自动断开时间, 单位: 秒
  autoBreakTime?: number
}

/**
 * SQL Server 2012 数据库连接详情信息
 */
interface SQLServer2012ConnectionInfo extends BaseConnectionDetail {
  // 服务器版本
  version?: string
  // 会话数
  sessionNum: number
  // 用户名
  username?: string
  // 密码
  password?: string
}
