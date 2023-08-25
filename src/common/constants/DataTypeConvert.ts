// 数据类型转换器, 将数据库的数据库类型转换成前端需要的类型

export const dataTypeConvert = (str: string): DbDataType => {
  switch (str) {
    case 'int':
    case 'tinyint':
    case 'mediumint':
    case 'smallint':
    case 'bigint':
    case 'decimal':
    case 'float':
    case 'double':
    case 'float':
      return 'number'
    case 'date':
      return 'date'
    case 'time':
      return 'time'
    case 'datetime':
    case 'timestamp':
      return 'datetime'
    case 'enum':
    case 'set':
      return 'enum'
    case 'blob':
    case 'longblob':
    case 'mediumblob':
    case 'tinyblob':
      return 'blob'
    default:
      return 'string'
  }
}
