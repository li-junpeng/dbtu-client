import { IRequest } from './axios-config'

/**
 * 测试连接
 *
 * @param connection 连接信息
 * @returns 后端处理结果
 */
export const testConnection = <T extends BaseConnectionDetail>(connection: ConnectionInfo<T>) => {
  return IRequest.post<void>('/datasource/connection/test', connection)
}
