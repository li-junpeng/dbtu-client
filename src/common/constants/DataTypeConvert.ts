// 数据类型转换器, 将数据库的数据库类型转换成前端需要的类型

/**
 * 转换数据类型
 *
 * @param str Java中的数据类型
 * @returns ts中的类型
 */
export const dataTypeConvert = (str: string): DbDataType => {
  switch (str) {
    case 'Long':
    case 'Integer':
    case 'Double':
    case 'BigDecimal':
      return 'number'
    case 'Date':
      return 'date'
    case 'Time':
      return 'time'
    case 'LocalDateTime':
    case 'Timestamp':
      return 'datetime'
    default:
      return 'string'
  }
}
