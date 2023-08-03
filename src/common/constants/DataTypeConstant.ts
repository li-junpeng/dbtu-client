export type MySQLDataTypeFieldOption =
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

export const MySQLDataType: Record<
  string,
  {
    // 默认的数据长度
    default: number
    // TODO 这里的可选参数要改成必填参数
    options?: MySQLDataTypeFieldOption[]
  }
> = {
  bigint: {
    default: 20,
    options: ['default_value', 'auto_increment', 'un_signed', 'zero_fill']
  },
  binary: {
    default: 1,
    options: ['default_value', 'key_length']
  },
  bit: {
    default: 1,
    options: ['default_value']
  },
  blob: {
    default: 0,
    options: ['key_length']
  },
  char: {
    default: 1,
    options: ['default_value', 'character', 'collate', 'key_length', 'binary']
  },
  date: {
    default: 0,
    options: ['default_value']
  },
  datetime: {
    default: 0,
    options: ['default_value', 'update_by_current_timestamp']
  },
  decimal: {
    default: 10,
    options: ['default_value', 'un_signed', 'zero_fill']
  },
  double: {
    default: 0,
    options: ['default_value', 'auto_increment', 'un_signed', 'zero_fill']
  },
  enum: {
    default: 0,
    options: ['enum_values', 'default_value', 'character', 'collate']
  },
  float: {
    default: 0,
    options: ['default_value', 'auto_increment', 'un_signed', 'zero_fill']
  },
  geometry: {
    default: 0
  },
  geometrycollection: {
    default: 0
  },
  int: {
    default: 11,
    options: ['default_value', 'auto_increment', 'un_signed', 'zero_fill']
  },
  json: {
    default: 0
  },
  linestring: {
    default: 0
  },
  longblob: {
    default: 0,
    options: ['key_length']
  },
  longtext: {
    default: 0,
    options: ['character', 'collate', 'key_length', 'binary']
  },
  mediumblob: {
    default: 0,
    options: ['key_length']
  },
  mediumint: {
    default: 9,
    options: ['default_value', 'auto_increment', 'un_signed', 'zero_fill']
  },
  mediumtext: {
    default: 0,
    options: ['character', 'collate', 'key_length', 'binary']
  },
  multilinestring: {
    default: 0
  },
  multipoint: {
    default: 0
  },
  multipolygon: {
    default: 0
  },
  point: {
    default: 0
  },
  polygon: {
    default: 0
  },
  set: {
    default: 0,
    options: ['enum_values', 'default_value', 'character', 'collate']
  },
  smallint: {
    default: 6,
    options: ['default_value', 'auto_increment', 'un_signed', 'zero_fill']
  },
  text: {
    default: 0,
    options: ['character', 'collate', 'key_length', 'binary']
  },
  time: {
    default: 0,
    options: ['default_value']
  },
  timestamp: {
    default: 0,
    options: ['default_value', 'update_by_current_timestamp']
  },
  tinyblob: {
    default: 0,
    options: ['key_length']
  },
  tinyint: {
    default: 4,
    options: ['default_value', 'auto_increment', 'un_signed', 'zero_fill']
  },
  tinytext: {
    default: 0,
    options: ['character', 'collate', 'key_length', 'binary']
  },
  varbinary: {
    default: 255,
    options: ['key_length']
  },
  varchar: {
    default: 255,
    options: ['default_value', 'character', 'collate', 'key_length', 'binary']
  },
  year: {
    default: 4,
    options: ['default_value']
  }
}
