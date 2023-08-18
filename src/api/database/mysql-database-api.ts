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