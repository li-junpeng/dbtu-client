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