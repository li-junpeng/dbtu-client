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
type ConnectionTypeKey = 'normal' | 'only_url'

/**
 * MySQL驱动
 */
type MySQLDriverKey = 'mysql' | 'mysql_5_1' | 'mariadb'

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

/**
 * 连接树的节点父对象，所有节点必须要继承此对象
 */
interface ConnectionTreeNode {
  // 主键
  id: number | null
  // 连接名
  name: string
  // 节点类型
  nodeType: ConnectionNodeType
  // session id, 除了nodeType = 'group', 这个值应该为必填项
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

  /**
   * 此处的children应该为以下节点:
   * - TableNode
   * - ViewNode
   * - FunctionNode
   * - SearchNode
   * - BackupNode
   */
  children?: (TableNode | ViewNode | FunctionNode | SearchNode | BackupNode)[]
}

/**
 * 表节点
 *
 * @param T 具体的数据表实例信息，比如MySqlTableInstance
 */
interface TableNode<T extends TableInstanceNode> extends ConnectionTreeNode {
  /**
   * 数据库ID
   */
  database: string

  /**
   * 节点类型
   */
  nodeType: 'table'

  /**
   * 表实例列表
   */
  children?: T[]
}

/**
 * 表实例节点
 */
interface TableInstanceNode extends ConnectionTreeNode {
  /**
   * 数据库名
   */
  database: string

  /**
   * 节点类型为表实例
   */
  nodeType: 'table_instance'

  /**
   * 注释
   */
  comment: string | null

  /**
   * 引擎
   */
  engine: string | null

  /**
   * 字段信息列表
   */
  columns: TableColumn[]

  /**
   * 索引信息
   */
  indexes: TableIndex[]

  /**
   * 外键信息
   */
  foreignKeys: TableForeignKey[]
  
}

/**
 * 视图节点
 */
interface ViewNode<T extends ViewInstanceNode> extends ConnectionTreeNode {
  /**
   * 数据库名
   */
  database: string
  nodeType: 'view'
  children?: T[]
}

/**
 * 视图实例节点
 */
interface ViewInstanceNode extends ConnectionTreeNode {
  nodeType: 'view_instance'

  /**
   * 数据库名
   */
  database: string
}

/**
 * 函数节点
 */
interface FunctionNode<T extends FunctionInstanceNode> extends ConnectionTreeNode {
  /**
   * 数据库名
   */
  database: string
  nodeType: 'function'
  children?: T[]
}

/**
 * 函数实例节点
 */
interface FunctionInstanceNode extends ConnectionTreeNode {
  /**
   * 数据库名
   */
  database: string
  nodeType: 'function_instance'

  /**
   * 所属的数据库名称
   */
  database: string
}

/**
 * 查询节点
 */
interface SearchNode<T extends SearchInstanceNode> extends ConnectionTreeNode {
  /**
   * 数据库名
   */
  database: string
  nodeType: 'search'
  children?: T[]
}

/**
 * 查询实例节点
 */
interface SearchInstanceNode extends ConnectionTreeNode {
  /**
   * 数据库名
   */
  database: string
  nodeType: 'search_instance'
}

/**
 * 备份节点
 */
interface BackupNode<T extends BackupInstanceNode> extends ConnectionTreeNode {
  /**
   * 数据库名
   */
  database: string
  nodeType: 'backup'
  children?: T[]
}

/**
 * 备份实例节点
 */
interface BackupInstanceNode extends ConnectionTreeNode {
  /**
   * 数据库名
   */
  database: string
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

interface WorkTabItemProp {
  /**
   * 选项卡的ID
   */
  workTabId: string

  [key: string]: any
}