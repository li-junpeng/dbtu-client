/**
 * 生成创建表的SQL
 *
 * @param database  所属的数据库
 * @param fields    字段列表
 * @returns SQL语句
 */
export const genCreateTableSql = (database: MySqlDatabaseInstance, fields: MySqlTableField[]) => {
  if (fields.length === 0) return ''

  // 记录是主键的字段
  const pks = [] as string[]

  // 获取数据类型长度
  const getDataTypeAndLength = (field: MySqlTableField) => {
    let str = ` ${field.dataType}`
    if (!field.maxLength) return str

    str += `(${field.maxLength || 0}`
    // 小数点
    if (field.decimalPoint) str += `, ${field.decimalPoint}`
    return (str += ')')
  }

  // isNull
  const getNotNull = (value: 0 | 1) => {
    return value === 1 ? ' NOT NULL' : ' NULL'
  }

  // 注释
  const getComment = (str?: string) => {
    return str ? ` COMMENT '${str}'` : ''
  }

  // 虚拟
  const getVirtual = (field: MySqlTableField) => {
    if (!field.virtual) return ''
    return ` AS (${field.options['virtualExp'] || ''})${field.options['virtualType'] ? ' ' + field.options['virtualType'] : ''}`
  }

  let sql = `CREATE TABLE \`${database.name}\`.\`Untitled\` (\n`
  fields.forEach(item => {
    if (!item.field) return
    // 主SQL
    sql += `\t\`${item.field}\`${getDataTypeAndLength(item)}${getVirtual(item)}${getNotNull(item.notNull)}${getComment(
      item.comment
    )},\n`
    // 记录主键
    item.pk && pks.push(item.field)
  })

  // 拼接主键
  if (pks.length >= 1) {
    sql += `\tPRIMARY KEY (${pks.map(item => `\`${item}\``).join(', ')})`
  } else {
    // 删除最后的逗号和换行符
    sql = sql.substring(0, sql.length - 2)
  }

  return sql + '\n);'
}
