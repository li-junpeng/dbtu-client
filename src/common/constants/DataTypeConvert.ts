// 数据类型转换器, 将数据库的数据库类型转换成前端需要的类型

/**
 * 转换数据类型
 *
 * @param str 数据库的数据类型
 * @returns ts中的类型
 */
export const dataTypeConvert = (str: string): DbDataType => {
  // mysql, 有的类型后面会加上`unsigned`等字符, 需要处理一下
  str = str.split(' ')[0]
  switch (str) {
    case 'int':
    case 'mediumint':
    case 'tinyint':
    case 'smallint':
    case 'bigint':
    case 'decimal':
    case 'double':
    case 'float':
      return 'number'
    case 'date':
      return 'date'
    case 'time':
      return 'time'
    case 'enum':
      return 'enum'
    case 'set':
      return 'set'
    case 'datetime':
    case 'timestamp':
      return 'datetime'
    case 'blob':
    case 'longblob':
    case 'mediumblob':
    case 'tinyblob':
      return 'blob'
    default:
      return 'string'
  }
}
