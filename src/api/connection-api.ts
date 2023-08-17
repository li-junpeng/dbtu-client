import { IRequest } from './axios-config'

/**
 * 测试连接
 *
 * @param connection 连接信息
 * @returns 后端处理结果
 */
export const testConnection = (connection: ConnectionInfo<BaseConnectionDetail>) => {
  return IRequest.post<void>('/datasource/connection/test', connection)
}

/**
 * 打开连接
 *
 * @param connection 连接信息
 * @returns 需要返回数据库列表
 */
export const openConnection = <T>(connection: ConnectionInfo<BaseConnectionDetail>) => {
  return IRequest.post<T>('/datasource/connection/open', connection)
}
