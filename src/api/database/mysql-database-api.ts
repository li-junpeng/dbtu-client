import { IRequest } from '../axios-config'

/**
 * 创建数据库
 *
 * @param database 数据库信息
 * @returns 创建后的数据库对象
 */
export const createDatabase = (database: MySqlDatabaseInstance) => {
  return IRequest.post<MySqlDatabaseInstance>('/database/mysql/create-database', database)
}

/**
 * 删除数据库
 *
 * @param sessionId     连接会话ID
 * @param databaseName  数据库名称
 * @returns void
 */
export const deleteDatabase = (sessionId: number, databaseName: string) => {
  return IRequest.post<void>('/database/mysql/drop-database', { sessionId, databaseName })
}

/**
 * 编辑数据库
 *
 * @param database 数据库信息
 * @returns void
 */
export const alterDatabase = (database: MySqlDatabaseInstance) => {
  return IRequest.post<void>('/database/mysql/alter-database', database)
}

/**
 * 获取数据库下的对象信息
 *
 * @param sessionId    链接会话ID
 * @param databaseName 数据库名
 * @returns 表、视图、函数和存储过程等信息集合
 */
export const getDatabaseObject = (sessionId: number, databaseName: string) => {
  return IRequest.get<{
    tables: MySqlTableInstance[]
    views: MySqlViewInstance[]
    functions: MySqlFunctionInstance[]
  }>('/database/mysql/object', {
    params: { sessionId, databaseName }
  })
}

/**
 * 查询指定数据库下指定表的数据
 * 
 * @param searchParam 查询参数
 * @returns 查询表数据SQL执行结果
 */
export const queryTableData = (searchParam: SearchTableParam) => {
  return IRequest.get<SQLExecuteResult>('/database/mysql/table-data', {
    params: searchParam
  })
}