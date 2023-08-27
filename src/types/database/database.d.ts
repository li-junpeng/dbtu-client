/**
 * 查询表数据时需要的筛选条件
 */
interface SearchTableFilterParam {
  /**
   * 字段名
   */
  field: string

  /**
   * 运算符
   */
  operator: string

  /**
   * 值
   */
  value: string | number | boolean

  /**
   * 与上一个同级别条件的关系
   */
  relation: 'AND' | 'OR'

  /**
   * 子条件
   */
  children: SearchTableFilterParam[]

  /**
   * 与子条件的关系
   */
  childrenRelation?: 'AND' | 'OR'

}

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

  /**
   * 筛选条件
   */
  filters?: SearchTableFilterParam[]

  /**
   * 排序规则
   */
  sorts?: {
    /**
     * 字段名
     */
    field: string

    /**
     * 排序规则
     */
    rule: 'ASC' | 'DESC'
  }[]
}

/**
 * 查询表数据时的表字段信息(想要字段的其他属性信息, 参考TableColumn类)
 */
interface SearchTableField {
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
  columns: SearchTableField[]

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
 * 表字段信息
 */
interface TableColumn {
  /**
   * id
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
   * 精度
   */
  precision: number

  /**
   * 小数点
   *
   * @default 0
   */
  scale?: number

  /**
   * 不为NULL
   *
   * @default false
   */
  notNull?: boolean

  /**
   * 是否是主键
   *
   * @default false
   */
  pk?: boolean

  /**
   * 注释
   */
  comment: string | null

  /**
   * 默认值
   */
  defaultValue: any

  /**
   * 自动递增
   *
   * @default false
   */
  autoIncrement?: boolean

  /**
   * 无符号
   */
  unsigned?: boolean

  /**
   * 零填充
   */
  zeroFill?: boolean

  /**
   * 是否为二进制
   */
  binary?: boolean

  /**
   * 字符集
   */
  charSet?: string

  /**
   * 排序规则
   */
  collate?: string

  /**
   * 是否根据当前时间戳更新
   */
  onUpdateTimestamp?: boolean

  /**
   * 枚举值
   */
  enums: string[]
}

/**
 * 索引信息
 */
interface TableIndex {
  /**
   * id
   */
  id: number

  /**
   * 索引名
   */
  name: string

  /**
   * 字段
   */
  columns: { id: number; name: string; precision?: number }[]

  /**
   * 索引类型
   */
  type: string

  /**
   * 注释
   */
  comment: string
}

/**
 * 外键信息
 */
interface TableForeignKey {
  /**
   * id
   */
  id: number

  /**
   * 外键名
   */
  name: string

  /**
   * 当前所属的表字段
   */
  referencingColumns: { id: number; name: string }[]

  /**
   * 被引用的模式
   */
  referencedSchema: string

  /**
   * 被引用的表
   */
  referencedTable: string

  /**
   * 被引用的字段
   */
  referencedColumns: { id: number; name: string }[]

  /**
   * 注释
   */
  comment: string | null
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
