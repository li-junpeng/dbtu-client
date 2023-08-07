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
  field: string

  /**
   * 数据类型
   */
  dataType: string

  /**
   * 数据类型的最大长度
   */
  maxLength?: number

  /**
   * 小数点
   */
  decimalPoint: number

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
 * MySql表的触发器
 */
interface MySqlTableTrigger {
  /**
   * ID, 在展示的时候有用, 对数据库没用任何作用
   */
  id: number
  /**
   * 触发器的名称
   */
  name: string

  /**
   * 触发方式
   */
  trigger?: 'AFTER' | 'BEFORE'

  /**
   * 触发时机, 在${trigger}时触发
   */
  timing?: 'INSERT' | 'UPDATE' | 'DELETE'

  /**
   * sql定义
   */
  sql?: string
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
}

/**
 * 表索引字段信息
 */
interface MySqlTableIndexField {
  /**
   * id, 仅在展示时使用, 不影响MySQL
   */
  id: number,

  /**
   * 字段名
   */
  field: string,

  /**
   * 子部分
   */
  subPart?: number
}