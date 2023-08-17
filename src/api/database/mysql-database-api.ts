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
