/**
 * MySql表的属性
 */
export interface MySqlTableOption {
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
  key_block_size: number
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
  statsAutoRecalc: 0 | 1 | 'default'
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
   * 加密. 如果该属性的值为true, 在拼接SQL时, 值记得改为'Y'
   * 
   * @default false
   */
  encryption: boolean
  /**
   * 联合, 只有引擎 = MRG_MYISAM 时可用
   */
  union?: string

  // TODO MyISAM 这个引擎的属性还没有定义呢...下班, Go back home
}