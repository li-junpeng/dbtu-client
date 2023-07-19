import { MySQLConnectionSession } from '@/components/database/mysql/connection-session'
import { SqlServer2012ConnectionSession } from '@/components/database/sql_server_2012/connection-session'

export interface ConnectionSession<T extends BaseConnectionDetail> {

  /**
   * 连接信息
   */
  connection: ConnectionInfo<T>

  open(): Promise<IResponse<ConnectionTreeNode[]>>

  close(): Promise<IResponse<void>>

}

export class ConnectionSessionFactory {

  static createSession(dbType: DatabaseIdent, connection: ConnectionInfo<BaseConnectionDetail>) {
    switch (dbType) {
      case 'mysql':
        return new MySQLConnectionSession(connection as ConnectionInfo<MySQLConnectionInfo>)
      case 'sql_server_2012':
        return new SqlServer2012ConnectionSession(connection as ConnectionInfo<SQLServer2012ConnectionInfo>)
      default:
        throw new Error(`创建数据库连接会话失败，无法识别的数据库类型: "${dbType}"`)
    }
  }

}
