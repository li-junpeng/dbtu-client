import type { ConnectionSession } from '@/components/database/connection-session'

export class MySQLConnectionSession implements ConnectionSession<MySQLConnectionInfo> {

  connection: ConnectionInfo<MySQLConnectionInfo>

  constructor(data: ConnectionInfo<MySQLConnectionInfo>) {
    this.connection = data
  }

  open(): Promise<IResponse<ConnectionTreeNode[]>> {
    const nodes = [] as ConnectionTreeNode[]
    for (let i = 0; i < 10; i++) {
      nodes.push({
        id: Date.now() + i,
        name: 'test_database_' + i,
        nodeType: 'database'
      } as DatabaseNode)
    }

    return Promise.resolve({
      status: 'success',
      data: nodes,
      message: `数据库 ${this.connection.name} 连接已打开`
    })
  }

  close(): Promise<IResponse<void>> {
    return Promise.resolve({
      status: 'success',
      data: void 0,
      message: `数据库 "${this.connection.name}" 连接已关闭`
    })
  }

}
