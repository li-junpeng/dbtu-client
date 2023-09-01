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
 * 查询指定数据库下的所有表信息
 *
 * @param sessionId     sessionId
 * @param databaseName  数据库名
 * @returns 表信息集合
 */
export const queryTableList = (sessionId: number, databaseName: string) => {
  return IRequest.get<MySqlTableInstance[]>('/database/mysql/table-list', {
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
  return IRequest.post<SQLExecuteResult>('/database/mysql/query/table-data', searchParam)
}

/**
 * 删除表
 *
 * @param sessionId     数据库连接会话ID
 * @param databaseName  数据库名
 * @param tableName     要删除的表名
 * @returns void
 */
export const dropTable = (sessionId: number, databaseName: string, tableName: string) => {
  return IRequest.post<void>('/database/mysql/drop-table', { sessionId, databaseName, tableName })
}

/**
 * 清空表数据
 *
 * @param sessionId     数据库连接会话ID
 * @param databaseName  数据库名
 * @param tableName     要删除的表名
 * @returns void
 */
export const deleteTable = (sessionId: number, databaseName: string, tableName: string) => {
  return IRequest.post<void>('/database/mysql/delete-table', { sessionId, databaseName, tableName })
}

/**
 * 截断表数据
 *
 * @param sessionId     数据库连接会话ID
 * @param databaseName  数据库名
 * @param tableName     要删除的表名
 * @returns void
 */
export const truncateTable = (sessionId: number, databaseName: string, tableName: string) => {
  return IRequest.post<void>('/database/mysql/truncate-table', { sessionId, databaseName, tableName })
}

/**
 * 重命名表名
 * 
 * @param sessionId    sessionId
 * @param databaseName 数据库名
 * @param oldTableName 旧表名
 * @param newTableName 新表名
 * @returns void
 */
export const renameTable = (sessionId: number, databaseName: string, oldTableName: string, newTableName: string) => {
  return IRequest.post<void>('/database/mysql/rename-table', { sessionId, databaseName, oldTableName, newTableName })
}

/**
 * 生成SQL语句
 *
 * @param tableInfo 表信息
 * @param triggers  触发器信息
 * @returns SQL语句
 */
export const generateCreateTableSql = (tableInfo: MySqlTableInstance, triggers: TableTrigger[]) => {
  return IRequest.post<string>('/database/mysql/generate-sql/create-table', { tableInfo, triggers })
}

/**
 * 创建表
 *
 * @param tableInfo 表信息
 * @param triggers  触发器
 * @returns void
 */
export const createTable = (sessionId: number, tableInfo: MySqlTableInstance, triggers: TableTrigger[]) => {
  return IRequest.post<void>('/database/mysql/create-table', { sessionId, tableInfo, triggers })
}
