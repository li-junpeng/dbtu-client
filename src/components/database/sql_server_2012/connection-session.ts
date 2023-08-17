import type { ConnectionSession } from '@/components/database/connection-session'

export class SqlServer2012ConnectionSession
  implements ConnectionSession<SQLServer2012ConnectionInfo>
{
  connection: ConnectionInfo<SQLServer2012ConnectionInfo>

  constructor(data: ConnectionInfo<SQLServer2012ConnectionInfo>) {
    this.connection = data
  }

  open(): Promise<void> {
    /* return Promise.resolve({
      status: 'success',
      data: [],
      message: `数据库 ${this.connection.name} 连接已打开`
    }) */
    return Promise.resolve()
  }

  close(): Promise<void> {
    /* return Promise.resolve({
      status: 'success',
      data: void 0,
      message: `数据库 "${this.connection.name}" 连接已关闭`
    }) */
    return Promise.resolve()
  }

  nodeContextmenu(event: MouseEvent, data: ConnectionTreeNode) {}

  onClickNode(data: ConnectionTreeNode) {}

  openCreateDatabase() {}
}
