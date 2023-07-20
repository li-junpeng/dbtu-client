import type { ConnectionSession } from '@/components/database/connection-session'
import Contextmenu from '@/components/ui/contextmenu/src/contextmenu-install'
import { useConnectionStore } from '@/stores/ConnectionStore'

const connectionStore = useConnectionStore()

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
        status: 'disable',
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
    data.status = 'loading'
    setTimeout(() => {
      data.children = []
      data.children.push({
        id: Date.now() + 1,
        sessionId: data.sessionId,
        name: '表',
        nodeType: 'table',
        children: []
      } as TableNode)
      data.children.push({
        id: Date.now() + 2,
        sessionId: data.sessionId,
        name: '视图',
        nodeType: 'view'
      } as ViewNode)
      data.children.push({
        id: Date.now() + 3,
        sessionId: data.sessionId,
        name: '函数',
        nodeType: 'function'
      } as FunctionNode)
      data.children.push({
        id: Date.now() + 4,
        sessionId: data.sessionId,
        name: '查询',
        nodeType: 'search'
      } as SearchNode)
      data.children.push({
        id: Date.now() + 5,
        sessionId: data.sessionId,
        name: '备份',
        nodeType: 'backup'
      } as BackupNode)

      data.status = 'enable'
      connectionStore.setExpandKey(id)
      connectionStore.refreshConnectionFlag++
    }, 1000)
  }

  const closeDatabase = () => {
    data.status = 'loading'
    setTimeout(() => {
      data.children = []
      data.status = 'disable'
      connectionStore.removeExpandKey(id)
      connectionStore.refreshConnectionFlag++
    }, 1000)
  }

  Contextmenu({
    event,
    menus: [
      {
        label: data.status === 'disable' ? '打开数据库' : data.status === 'enable' ? '关闭数据库' : '正在打开数据库',
        divided: true,
        disabled: data.status === 'loading',
        onClick: () => {
          if (data.status === 'disable') {
            openDatabase()
          } else {
            closeDatabase()
          }
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
