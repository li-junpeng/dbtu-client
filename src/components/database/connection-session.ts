import { MySQLConnectionSession } from '@/components/database/mysql/connection-session'
import { SqlServer2012ConnectionSession } from '@/components/database/sql_server_2012/connection-session'

export interface ConnectionSession<T extends BaseConnectionDetail> {
  /**
   * 连接信息
   */
  connection: ConnectionInfo<T>

  /**
   * 打开连接
   */
  open(): Promise<void>

  /**
   * 关闭连接
   */
  close(): Promise<void>

  /**
   * 刷新连接
   */
  refresh(): Promise<void>

  /**
   * 获取连接树节点的右键菜单
   *
   * @param event   鼠标事件对象
   * @param data
   */
  nodeContextmenu(event: MouseEvent, data: ConnectionTreeNode): void

  /**
   * 点击了连接树节点的事件
   *
   * @param data    节点数据
   */
  onClickNode(data: ConnectionTreeNode): void

  /**
   * 打开创建数据库对话框
   */
  openCreateDatabase(): void
}

export class ConnectionSessionFactory {
  static createSession(dbType: DatabaseIdent, connection: ConnectionInfo<BaseConnectionDetail>) {
    switch (dbType) {
      case 'mysql':
        return new MySQLConnectionSession(connection as ConnectionInfo<MySQLConnectionInfo>)
      case 'sql_server_2012':
        return new SqlServer2012ConnectionSession(
          connection as ConnectionInfo<SQLServer2012ConnectionInfo>
        )
      default:
        throw new Error(`创建数据库连接会话失败，无法识别的数据库类型: "${dbType}"`)
    }
  }
}
