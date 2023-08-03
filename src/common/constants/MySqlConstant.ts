// 引擎
export const Engines = [
  'ARCHIVE',
  'BLACKHOLE',
  'CSV',
  'InnoDB',
  'MEMORY',
  'MRG_MYISAM',
  'MyISAM',
  'PERFORMANCE_SCHEMA'
] as const

// 表空间
export const TableSpaces = [
  'innodb_file_per_table_2',
  'innodb_file_per_table_3',
  'innodb_file_per_table_4',
  'innodb_file_per_table_5',
  'innodb_file_per_table_6',
  'innodb_file_per_table_7',
  'innodb_file_per_table_8',
  'innodb_file_per_table_9',
  'innodb_file_per_table_10',
  'innodb_file_per_table_11',
  'innodb_file_per_table_12',
  'innodb_file_per_table_13',
  'innodb_file_per_table_14',
  'innodb_file_per_table_15',
  'innodb_file_per_table_16',
  'innodb_file_per_table_17',
  'innodb_file_per_table_18',
  'innodb_file_per_table_19',
  'innodb_file_per_table_20',
  'innodb_file_per_table_21',
  'innodb_file_per_table_25',
  'innodb_file_per_table_27',
  'innodb_file_per_table_28',
  'innodb_file_per_table_64',
  'innodb_file_per_table_72',
  'innodb_file_per_table_73',
  'innodb_system',
  'innodb_temporary'
] as const

// 存储
export const Storages = ['DEFAULT', 'DISK', 'MEMORY'] as const

// 行格式
export const RowFormats = [
  'COMPACT',
  'COMPRESSED',
  'DEFAULT',
  'DYNAMIC',
  'FIXED',
  'REDUNDANT'
] as const

// 压缩
export const Compressions = ['LZ4', 'NONE', 'ZLIB'] as const

// 通用下拉列表框值
export const CommonSelectOptions = [0, 1, 'default'] as const
