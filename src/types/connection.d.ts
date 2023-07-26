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
  | 'function_instance' // 函数实例
  | 'trigger'           // 触发器
  | 'backup'            // 备份
  | 'backup_instance'   // 备份实例
  | 'search'            // 查询
  | 'search_instance'   // 查询实例

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
  nodeType: 'group'
  children?: ConnectionInfo<BaseConnectionDetail>[]
}

interface DatabaseNode extends ConnectionTreeNode {
  nodeType: 'database'
  status: CommonStatusType
  children?: ConnectionTreeNode[]
}

interface MySqlDatabaseNode extends DatabaseNode {
  // 字符集
  character: string
  // 排序规则
  collate: string
}

interface TableNode extends ConnectionTreeNode {
  nodeType: 'table'
  children?: ConnectionTreeNode[]
}

interface TableInstanceNode extends ConnectionTreeNode {
  nodeType: 'table_instance'
}

interface MySqlTableNode extends TableInstanceNode {
  // 数据库ID
  databaseId: number
  // 自动递增值
  autoIncrement: number | null
  // 修改日期
  updateTime: string | null
  // 数据长度, 单位: byte
  dataLength: number
  // 引擎
  engine: string
  // 行
  rowsNum: number
  // 注释
  comment: string | null
}

interface ViewNode extends ConnectionTreeNode {
  nodeType: 'view'
  children?: ConnectionTreeNode[]
}

interface ViewInstanceNode extends ConnectionTreeNode {
  nodeType: 'view_instance'
}

interface FunctionNode extends ConnectionTreeNode {
  nodeType: 'function'
  children?: ConnectionTreeNode[]
}

interface FunctionInstanceNode extends ConnectionTreeNode {
  nodeType: 'function_instance'
}

interface SearchNode extends ConnectionTreeNode {
  nodeType: 'search'
  children?: ConnectionTreeNode[]
}

interface SearchInstanceNode extends ConnectionTreeNode {
  nodeType: 'search_instance'
}

interface BackupNode extends ConnectionTreeNode {
  nodeType: 'backup'
  children?: ConnectionTreeNode[]
}

interface BackupInstanceNode extends ConnectionTreeNode {
  nodeType: 'backup_instance'
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

interface WorkTabItem {
  // ID, 建议使用${connectionId}_${database_id}_${table_id}之类的多个ID进行拼接
  id: string
  // tab标签的名称
  label: string
  // 是否需要保存的标识，值 = true时，在标签左侧显示*字符
  saveFlag?: boolean
  // tab的内容组件
  component: () => Promise<{}> | {}
  // 传入组件的数据，propName is data
  props?: any
}
