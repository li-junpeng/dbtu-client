/**
 * MySQL数据库连接详情信息
 */
interface MySQLConnectionInfo extends BaseConnectionDetail {
  /**
   * 驱动
   */
  driver: MySQLDriverKey

  /**
   * 连接类型
   */
  connectionType: ConnectionTypeKey

  /**
   * 服务器版本
   */
  version?: string

  /**
   * 会话数
   */
  sessionNum?: number

  /**
   * 用户名
   */
  username?: string

  /**
   * 密码
   */
  password?: string

  /**
   * 认证方式
   */
  authType: AuthenticationTypeKey

  /**
   * 保存密码的方式
   */
  savePwdType: SavePasswordTypeKey

  /**
   * url
   */
  url?: string

  /**
   * 时区
   */
  timeZone?: string

  /**
   * 字符集编码
   */
  charset: string

  /**
   * 是否开启保持连接间隔
   */
  connectionInterval: boolean

  /**
   * 保持连接间隔时间, 单位: 秒
   */
  connectionIntervalTime?: number

  /**
   * 是否开启自动断开功能
   */
  autoBreak: boolean

  /**
   * 自动断开时间, 单位: 秒
   */
  autoBreakTime?: number
}

/**
 * MySQL 数据库节点信息
 *
 * 数据库节点的子节点如下:
 * - table(数据表)
 * - view(数据视图)
 * - function(函数)
 * - search(保存的查询)
 * - backup(备份)
 */
interface MySqlDatabaseInstance extends DatabaseNode {
  /**
   * 字符集
   */
  character: string

  /**
   * 排序规则
   */
  collate: string
}

/**
 * MySQL表实例
 */
interface MySqlTableInstance extends TableInstanceNode {
  /**
   * 自动递增值
   */
  autoIncrement: number | null

  /**
   * 修改日期
   */
  updateTime: string | null

  /**
   * 数据长度, 单位: byte
   */
  dataLength: number

  /**
   * 行
   */
  rowsNum: number

  /**
   * 注释
   */
  comment: string | null

  /**
   * 引擎
   */
  engine: string

  /**
   * 表字段信息
   */
  fields: MySqlTableField[]

  /**
   * 索引信息
   */
  indexes: MySqlTableIndex[]

  /**
   * 外键信息
   */
  foreignKeys: MySqlTableForeignKey[]

  /**
   * 表属性
   * TODO 将属性平铺出来...
   */
  option: MySqlTableOption
}

/**
 * MySql表字段信息
 */
interface MySqlTableField {
  /**
   * 展示时需要, 不影响MySQL
   */
  id: number

  /**
   * 字段名
   */
  name: string

  /**
   * 数据类型
   */
  dataType: string

  /**
   * 数据类型的最大长度
   */
  precision?: number

  /**
   * 小数点
   */
  scale: number

  /**
   * 不为空
   */
  notNull: 1 | 0

  /**
   * 虚拟
   */
  virtual: 1 | 0

  /**
   * 主键
   */
  pk: boolean

  /**
   * 注释
   */
  comment?: string

  /**
   * 字段属性
   */
  options: Record<string, any>
}

/**
 * MySql表字段属性的key
 */
type MySqlTableFieldOption =
  | 'default_value' // 默认值, 值有EMPTY_STRING、NULL
  | 'auto_increment' // 自动递增
  | 'un_signed' // 无符号
  | 'zero_fill' // 零填充
  | 'key_length' // 键长度
  | 'character' // 字符集
  | 'collate' // 排序规则
  | 'binary' // 二进制
  | 'update_by_current_timestamp' // 根据当前时间戳更新
  | 'enum_values' // 设置枚举值

/**
 * MySql表的属性
 */
interface MySqlTableOption {
  /**
   * 引擎
   *
   * @default InnoDB
   */
  engine: string

  /**
   * 表空间
   */
  tableSpace?: string

  /**
   * 存储
   */
  storage?: string

  /**
   * 字符集
   */
  character?: string

  /**
   * 排序规则
   */
  collate?: string

  /**
   * 行格式
   */
  rowFormat?: string

  /**
   * 自动递增
   *
   * @default 0
   */
  autoIncrement: number

  /**
   * 平均行长度
   *
   * @default 0
   */
  avgRowLength: number

  /**
   * 最大行数
   *
   * @default 0
   */
  maxRows: number

  /**
   * 最小行数
   *
   * @default 0
   */
  minRows: number

  /**
   * 键块大小
   *
   * @default 0
   */
  keyBlockSize: number

  /**
   * 数据目录
   */
  dataDirectory?: string

  /**
   * 索引目录
   */
  indexDirectory?: string

  /**
   * 统计数据自动重计
   */
  statsAutoRecalc?: 0 | 1 | 'default'

  /**
   * 统计数据持久化
   */
  statsPersistent?: 0 | 1 | 'default'

  /**
   * 统计样本页面
   *
   * @default 0
   */
  statsSamplePages: number

  /**
   * 压缩
   */
  compression?: string

  /**
   * 加密
   *
   * 如果为true时, SQL: ENCRYPTION = 'Y'
   *
   * @default false
   */
  encryption: boolean

  /**
   * 联合(只有引擎 = MRG_MYISAM 时可用)
   *
   * SQL: UNION = (${union})
   */
  union?: string

  /**
   * 插入方法(只有引擎 = MRG_MYISAM 时可用)
   *
   * SQL: INSERT_METHOD = ${insertMethod}
   */
  insertMethod?: 0 | 1 | 'default'

  /**
   * 校验和(只有引擎 = MyISAM时生效)
   *
   * 如果值为true时, SQL: CHECKSUM = 1
   */
  checksum?: boolean

  /**
   * 封装键(只有引擎 = MyISAM时生效)
   *
   * SQL:  PACK_KEYS = ${packKeys}
   */
  packKeys?: 0 | 1 | default

  /**
   * 延迟键写入(只有引擎 = MyISAM时生效)
   *
   * 如果值为true时, SQL: DELAY_KEY_WRITE = 1
   */
  delayKeyWrite?: boolean
}

/**
 * 表索引
 */
interface MySqlTableIndex {
  /**
   * 做展示的时候需要，不影响mysql
   */
  id: number
  /**
   * 索引名
   */
  name: string

  /**
   * 字段, 多个字段使用逗号隔开
   */
  fields: MySqlTableIndexField[]

  /**
   * 索引类型
   */
  indexType?: string

  /**
   * 索引方法
   */
  indexMethod?: 'BTREE' | 'HASH'

  /**
   * 注释
   */
  comment?: string

  /**
   * 键块大小
   */
  keyBlockSize?: number

  /**
   * 解析器
   */
  parser?: string
}

/**
 * 表索引字段信息
 */
interface MySqlTableIndexField {
  /**
   * id, 仅在展示时使用, 不影响MySQL
   */
  id: number

  /**
   * 字段名
   */
  field: string

  /**
   * 子部分
   */
  subPart?: number
}

interface MySqlTableForeignKey {
  /**
   * 仅在前端展示时使用, 不影响MySQL
   */
  id: number

  /**
   * 外键名
   */
  name: string

  /**
   * 字段名(当前表的字段)
   *
   * @default []
   */
  fields?: {
    id: number
    field: string
  }[]

  /**
   * 被引用的数据库
   *
   * @default 表当前所在的数据库
   */
  refDatabase?: string

  /**
   * 被引用的表, 从被引用的数据库中进行选择
   */
  refTable?: string

  /**
   * 被引用的字段, 从被引用的表中进行选择
   *
   * @default []
   */
  refFields?: string[]

  /**
   * 删除
   */
  deleteMode?: 'CASCADE' | 'NO ACTION' | 'RESTRICT' | 'SET NULL'

  /**
   * 更新
   */
  updateMode?: 'CASCADE' | 'NO ACTION' | 'RESTRICT' | 'SET NULL'
}

interface MySqlViewInstance extends ViewInstanceNode {
  /**
   * SQL语句
   */
  viewSql: string

  /**
   * 是否可以更新
   *
   * - YES: 是
   * - NO: 否
   */
  updatable: 'YES' | 'NO'
}

interface MySqlFunctionInstance extends FunctionInstanceNode {
  /**
   * 类型
   *
   * - FUNCTION: 函数
   * - PROCEDURE: 存储过程
   */
  type: 'FUNCTION' | 'PROCEDURE'

  /**
   * 更新时间
   */
  updateTime: number

  /**
   * 注释
   */
  comment: comment | null

  /**
   * 决定性
   * 
   * - YES: 是
   * - NO: 否
   */
  deterministic: 'YES' | 'NO'
}
