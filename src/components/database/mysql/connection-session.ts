import type { ConnectionSession } from '@/components/database/connection-session'
import Contextmenu from '@/components/ui/contextmenu/src/contextmenu-install'

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
        nodeType: 'database',
        sessionId: this.connection.id
      } as DatabaseNode)
    }
    this.connection.children = nodes

    return Promise.resolve({
      status: 'success',
      data: nodes,
      message: `数据库 ${this.connection.name} 连接已打开`
    })
  }

  close(): Promise<IResponse<void>> {
    this.connection.children = []
    return Promise.resolve({
      status: 'success',
      data: void 0,
      message: `数据库 "${this.connection.name}" 连接已关闭`
    })
  }

  nodeContextmenu(event: MouseEvent, data: ConnectionTreeNode) {
    switch (data.nodeType) {
      case 'database':
        DatabaseContextmenu(event, data as DatabaseNode)
        break
    }
  }
}

const DatabaseContextmenu = (event: MouseEvent, data: DatabaseNode) => {
  const id = data.id as number

  const openDatabase = () => {

  }

  Contextmenu({
    event,
    menus: [
      {
        label: '打开数据库',
        divided: true,
        onClick: () => {
          openDatabase()
        }
      },
      {
        label: '编辑数据库',
        disabled: true
      },
      {
        label: '新建数据库',
        disabled: true
      },
      {
        label: '删除数据库',
        divided: true,
        disabled: true
      },
      {
        label: '新建查询',
        divided: true,
        disabled: true
      },
      {
        label: '运行SQL文件',
        disabled: true
      },
      {
        label: '转储SQL文件',
        disabled: true,
        children: [
          {
            label: '结构和数据',
            disabled: true
          },
          {
            label: '仅结构 ',
            disabled: true
          }
        ]
      },
      {
        label: '在数据库中查找',
        divided: true,
        disabled: true
      },
      {
        label: '刷新',
        disabled: true
      }
    ]
  })
}
