import type { ConnectionSession } from '@/components/database/connection-session'
import Contextmenu from '@/components/ui/contextmenu/src/contextmenu-install'
import { useConnectionStore } from '@/stores/ConnectionStore'
import { useConnectionSessionStore } from '@/stores/ConnectionSessionStroe'
import { useWorkTabStore } from '@/stores/WorkTabStore'
import { MessageBox } from '@/components/element-plus/el-feedback-util'
import { TextConstant } from '@/common/constants/TextConstant'

const connectionStore = useConnectionStore()
const workTabStore = useWorkTabStore()

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
        TreeNodeContextmenu.database(event, data as DatabaseNode)
        break
      case 'table':
        TreeNodeContextmenu.table(event, data as TableNode)
        break
      case 'table_instance':
        TreeNodeContextmenu.tableInstance(event, data as TableInstanceNode)
        break
      case 'view':
        TreeNodeContextmenu.view(event, data as ViewNode)
        break
      case 'view_instance':
        TreeNodeContextmenu.viewInstance(event, data as ViewInstanceNode)
        break
      case 'function':
        TreeNodeContextmenu.function(event, data as FunctionNode)
        break
      case 'function_instance':
        TreeNodeContextmenu.functionInstance(event, data as FunctionInstanceNode)
        break
      case 'search':
        TreeNodeContextmenu.search(event, data as SearchNode)
        break
      case 'search_instance':
        TreeNodeContextmenu.searchInstance(event, data as SearchInstanceNode)
        break
      case 'backup':
        TreeNodeContextmenu.backup(event, data as BackupNode)
        break
      case 'backup_instance':
        TreeNodeContextmenu.backupInstance(event, data as BackupInstanceNode)
        break
    }
  }

  onClickNode(data: ConnectionTreeNode) {
    switch (data.nodeType) {
      case 'table':
        ClickNode.table(data as TableNode)
        break
    }
  }
}

const TreeNodeContextmenu = {

  database: (event: MouseEvent, data: DatabaseNode) => {
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
          children: ['administrative_cont', 'administrative_cont_pdf', 'sys_user', 'sys_role', 'sys_user_role', 'sys_log'].map((item, index) => {
            return {
              id: index + 1,
              name: item,
              sessionId: data.sessionId,
              nodeType: 'table_instance'
            }
          }) as TableInstanceNode[]
        } as TableNode)
        data.children.push({
          id: Date.now() + 2,
          sessionId: data.sessionId,
          name: '视图',
          nodeType: 'view',
          children: ['getAfterMissData', 'getMissData', 'getMorMissData', 'getNormalData'].map((item, index) => {
            return {
              id: index + 1,
              name: item,
              sessionId: data.sessionId,
              nodeType: 'view_instance'
            }
          }) as ViewInstanceNode[]
        } as ViewNode)
        data.children.push({
          id: Date.now() + 3,
          sessionId: data.sessionId,
          name: '函数',
          nodeType: 'function',
          children: ['fun_diff_day_dur', 'fun_name_day_dur', 'proc_init_normal', 'proc_init_unusual', 'proc_leave_everyday'].map((item, index) => {
            return {
              id: index + 1,
              name: item,
              sessionId: data.sessionId,
              nodeType: 'function_instance'
            }
          }) as FunctionInstanceNode[]
        } as FunctionNode)
        data.children.push({
          id: Date.now() + 4,
          sessionId: data.sessionId,
          name: '查询',
          nodeType: 'search',
          children: ['select_rb_by_user', 'select_report_by_user'].map((item, index) => {
            return {
              id: index + 1,
              name: item,
              sessionId: data.sessionId,
              nodeType: 'search_instance'
            }
          }) as SearchInstanceNode[]
        } as SearchNode)
        data.children.push({
          id: Date.now() + 5,
          sessionId: data.sessionId,
          name: '备份',
          nodeType: 'backup',
          children: ['20230705095432', '2023-03-07_1456', '清空个人地图数据前', '清空模板组件数据前'].map((item, index) => {
            return {
              id: index + 1,
              name: item,
              sessionId: data.sessionId,
              nodeType: 'backup_instance'
            }
          }) as BackupInstanceNode[]
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
  },

  table: (event: MouseEvent, data: TableNode) => {
    console.log(data)


    Contextmenu({
      event,
      menus: [
        {
          label: '新建表',
          divided: true
        },
        {
          label: '导入向导'
        },
        {
          label: '导出向导',
          divided: true
        },
        {
          label: '运行SQL文件'
        },
        {
          label: '在数据库中查找',
          divided: true
        },
        {
          label: '刷新'
        }
      ]
    })
  },

  tableInstance: (event: MouseEvent, data: TableInstanceNode) => {
    const deleteTable = () => {
      MessageBox.deleteConfirm(TextConstant.deleteConfirm(data.name), (done) => {
        // TODO 掉接口删除表，然后重新刷新列表
        done()
        connectionStore.refreshConnectionFlag++
      }).then(() => {
      })
    }

    Contextmenu({
      event,
      menus: [
        {
          label: '打开表'
        },
        {
          label: '设计表'
        },
        {
          label: '新建表'
        },
        {
          label: '删除表',
          onClick: () => {
            deleteTable()
          }
        },
        {
          label: '清空表'
        },
        {
          label: '截断表'
        },
        {
          label: '复制表',
          children: [
            {
              label: '结构和数据'
            },
            {
              label: '仅结构'
            }
          ]
        },
        {
          label: '设置权限',
          divided: true
        },
        {
          label: '导入向导'
        },
        {
          label: '导出向导',
          divided: true
        },
        {
          label: '转储SQL文件',
          divided: true,
          children: [
            {
              label: '结构和数据'
            },
            {
              label: '仅结构'
            }
          ]
        },
        {
          label: '复制'
        },
        {
          label: '重命名',
          divided: true
        },
        {
          label: '刷新'
        },
        {
          label: '对象信息'
        }
      ]
    })
  },

  view: (event: MouseEvent, data: ViewNode) => {
    console.log(data)

    Contextmenu({
      event,
      menus: [
        {
          label: '新建视图',
          divided: true
        },
        {
          label: '导出向导',
          divided: true
        },
        {
          label: '刷新'
        }
      ]
    })
  },

  viewInstance: (event: MouseEvent, data: ViewInstanceNode) => {
    console.log(data)

    Contextmenu({
      event,
      menus: [
        {
          label: '打开视图'
        },
        {
          label: '设计视图'
        },
        {
          label: '新建视图'
        },
        {
          label: '删除视图'
        },
        {
          label: '设置权限',
          divided: true
        },
        {
          label: '导出向导',
          divided: true
        },
        {
          label: '复制'
        },
        {
          label: '重命名',
          divided: true
        },
        {
          label: '刷新'
        },
        {
          label: '对象信息'
        }
      ]
    })
  },

  function: (event: MouseEvent, data: FunctionNode) => {
    console.log(data)

    Contextmenu({
      event,
      menus: [
        {
          label: '新建函数',
          divided: true
        },
        {
          label: '刷新'
        }
      ]
    })
  },

  functionInstance: (event: MouseEvent, data: FunctionInstanceNode) => {
    console.log(data)

    Contextmenu({
      event,
      menus: [
        {
          label: '设计函数'
        },
        {
          label: '新建函数'
        },
        {
          label: '删除函数'
        },
        {
          label: '运行函数'
        },
        {
          label: '设置权限',
          divided: true
        },
        {
          label: '复制'
        },
        {
          label: '重命名',
          divided: true
        },
        {
          label: '刷新'
        },
        {
          label: '对象信息'
        }
      ]
    })
  },

  search: (event: MouseEvent, data: SearchNode) => {
    console.log(data)

    Contextmenu({
      event,
      menus: [
        {
          label: '新建查询',
          divided: true
        },
        {
          label: '打开外部查询',
          divided: true
        },
        {
          label: '刷新'
        }
      ]
    })
  },

  searchInstance: (event: MouseEvent, data: SearchInstanceNode) => {
    console.log(data)

    Contextmenu({
      event,
      menus: [
        {
          label: '设计查询'
        },
        {
          label: '新建查询'
        },
        {
          label: '删除查询',
          divided: true
        },
        {
          label: '导出向导',
          divided: true
        },
        {
          label: '复制'
        },
        {
          label: '重命名',
          divided: true
        },
        {
          label: '刷新'
        },
        {
          label: '对象信息'
        }
      ]
    })
  },

  backup: (event: MouseEvent, data: BackupNode) => {
    console.log(data)

    Contextmenu({
      event,
      menus: [
        {
          label: '新建备份',
          divided: true
        },
        {
          label: '从文件中还原备份'
        },
        {
          label: '从文件中提取SQL',
          divided: true
        },
        {
          label: '刷新'
        }
      ]
    })
  },

  backupInstance: (event: MouseEvent, data: BackupInstanceNode) => {
    console.log(data)

    Contextmenu({
      event,
      menus: [
        {
          label: '还原备份'
        },
        {
          label: '新建备份'
        },
        {
          label: '删除备份',
          divided: true
        },
        {
          label: '提取SQL',
          divided: true
        },
        {
          label: '复制'
        },
        {
          label: '重命名',
          divided: true
        },
        {
          label: '刷新'
        },
        {
          label: '对象信息'
        }
      ]
    })
  }

}

const ClickNode = {

  table: (data: TableNode) => {
    workTabStore.setObjectPane({
      props: data,
      component: () => import('@/components/database/mysql/work-tabs/object-pane/table-list.vue')
    })
  }

}
