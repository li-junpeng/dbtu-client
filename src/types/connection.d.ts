/**
 * 数据库标识
 */
type DatabaseIdent = 'mysql' | 'sql_server_2012'
/* | 'oracle'
 | 'postgre_sql'
 | 'dm'
 | 'mongodb'
 | 'hive'*/

type ConnectionNodeType =
  | 'connection' // 连接
  | 'group' // 分组
  | 'database' // 数据库
  | 'table' // 表
  | 'table_instance' // 表实例
  | 'view' // 视图
  | 'view_instance' // 视图实例
  | 'function' // 函数
  | 'function_instance' // 函数实例
  | 'trigger' // 触发器
  | 'backup' // 备份
  | 'backup_instance' // 备份实例
  | 'search' // 查询
  | 'search_instance' // 查询实例

/**
 * 数据库连接状态, | 正在连接 | 已连接 | 未连接
 */
type ConnectionStatusType = 'connecting' | 'connected' | 'no_connection'

type CommonStatusType = 'disable' | 'loading' | 'enable'

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
  groupId?: number
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

/**
 * 数据库节点
 */
interface DatabaseNode extends ConnectionTreeNode {
  nodeType: 'database'
  status: CommonStatusType
  children?: ConnectionTreeNode[]
}

/**
 * 表节点
 */
interface TableNode extends ConnectionTreeNode {
  // 数据库ID
  databaseId: number
  nodeType: 'table'
  children?: ConnectionTreeNode[]
}

/**
 * 表实例节点
 */
interface TableInstanceNode extends ConnectionTreeNode {
  // 数据库ID
  databaseId: number
  nodeType: 'table_instance'
}

/**
 * 视图节点
 */
interface ViewNode extends ConnectionTreeNode {
  nodeType: 'view'
  children?: ConnectionTreeNode[]
}

/**
 * 视图实例节点
 */
interface ViewInstanceNode extends ConnectionTreeNode {
  nodeType: 'view_instance'
}

/**
 * 函数节点
 */
interface FunctionNode extends ConnectionTreeNode {
  nodeType: 'function'
  children?: ConnectionTreeNode[]
}

/**
 * 函数实例节点
 */
interface FunctionInstanceNode extends ConnectionTreeNode {
  nodeType: 'function_instance'
}

/**
 * 查询节点
 */
interface SearchNode extends ConnectionTreeNode {
  nodeType: 'search'
  children?: ConnectionTreeNode[]
}

/**
 * 查询实例节点
 */
interface SearchInstanceNode extends ConnectionTreeNode {
  nodeType: 'search_instance'
}

/**
 * 备份节点
 */
interface BackupNode extends ConnectionTreeNode {
  nodeType: 'backup'
  children?: ConnectionTreeNode[]
}

/**
 * 备份实例节点
 */
interface BackupInstanceNode extends ConnectionTreeNode {
  nodeType: 'backup_instance'
}

interface BaseConnectionDetail {}

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
