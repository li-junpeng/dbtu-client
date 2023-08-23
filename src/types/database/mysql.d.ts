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
   * 字符集
   */
  charSet: string | null

  /**
   * 排序规则
   */
  collate: string | null

  /**
   * 行格式
   */
  rowFormat: string | null
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
 * 表索引
 */
interface MySqlTableIndex extends TableIndex {

  /**
   * 索引方法
   */
  method: string

  /**
   * 键块大小
   */
  keyBlockSize: number
}

interface MySqlTableForeignKey extends TableForeignKey {

  /**
   * 删除时的操作
   */
  onDelete: 'CASCADE' | 'NO_ACTION' | 'RESTRICT' | 'SET_NULL'

  /**
   * 更新时的操作
   */
  onUpdate: 'CASCADE' | 'NO_ACTION' | 'RESTRICT' | 'SET_NULL'
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
