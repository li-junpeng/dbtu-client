/**
 * 查询表数据需要的参数
 */
interface SearchTableParam {
  /**
   * 连接会话的ID
   */
  sessionId: number

  /**
   * 数据库名
   */
  databaseName: string

  /**
   * 表名
   */
  tableName: string

  /**
   * 分页参数, 当前页码, 从1开始计数
   */
  current?: number

  /**
   * 分页参数, 每页的记录数
   */
  page?: number
}

/**
 * 表字段信息
 */
interface TableField {
  /**
   * 在数据表中的字段名
   */
  name: string

  /**
   * SQL中为字段名起的别名
   */
  label: string

  /**
   * 在数据库中的数据类型
   */
  dataType: string

  /**
   * 在Java中的数据类型
   */
  dataTypeOfJava: string

  /**
   * 小数点
   */
  scale: number

  /**
   * 是否自增
   */
  autoIncrement: boolean
}

/**
 * SQL查询语句执行结果
 */
interface SqlQueryResult {
  /**
   * 列信息
   */
  columns: TableField[]

  /**
   * 行数据
   *
   * - key: 字段名
   * - value: 根据字段名去列信息查询数据类型
   */
  rows: Record<string, unknown>[]

  /**
   * 总记录数
   */
  total: number
}

/**
 * SQL执行结果
 */
interface SQLExecuteResult {
  /**
   * SQL是否执行成功
   */
  success: boolean

  /**
   * 消息内容, 当success = false时为必填项
   */
  message?: string

  /**
   * SQL执行的时间, 单位: ms
   */
  executeTime: number

  /**
   * 执行的SQL语句
   */
  originSql: string

  /**
   * SQL是否为查询语句
   */
  query?: boolean

  /**
   * 分页参数, 当前页, 仅查询语句生效
   */
  current?: number

  /**
   * SQL查询结果
   */
  queryResult?: SqlQueryResult

  /**
   * SQL更新的记录数, 除查询语句外生效
   */
  updateCount?: number
}

/**
 * MySql表的触发器
 */
interface TableTrigger {
  /**
   * ID, 在展示的时候有用, 对数据库没用任何作用
   */
  id: number

  /**
   * 触发器的名称
   */
  name: string

  /**
   * or replace
   */
  orReplace?: boolean

  /**
   * 触发器类型
   */
  type: 'BEFORE' | 'AFTER' | 'INSTEAD_OF'

  /**
   * 插入时触发
   */
  insert?: boolean

  /**
   * 更新时触发
   */
  update?: boolean

  /**
   * 删除时触发
   */
  delete?: boolean

  /**
   * 指定哪个表生效
   */
  table: string

  /**
   * for each row (行级触发器)
   */
  forEachRow?: boolean

  /**
   * 触发时执行的SQL
   */
  body: string
}
