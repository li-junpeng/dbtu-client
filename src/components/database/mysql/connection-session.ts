import type { ConnectionSession } from '@/components/database/connection-session'
import Contextmenu from '@/components/ui/contextmenu/src/contextmenu-install'
import { useConnectionStore } from '@/stores/ConnectionStore'
import { useWorkTabStore } from '@/stores/WorkTabStore'
import { useDynamicDialogStore } from '@/stores/DynamicDialogStore'
import { MessageBox } from '@/components/element-plus/el-feedback-util'
import { TextConstant } from '@/common/constants/TextConstant'

const connectionStore = useConnectionStore()
const workTabStore = useWorkTabStore()
const dynamicDialogStore = useDynamicDialogStore()

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
        TreeNodeContextmenu.database(event, data as MySqlDatabaseInstance, this)
        break
      case 'table':
        TreeNodeContextmenu.table(event, data as TableNode<MySqlTableInstance>, this)
        break
      case 'table_instance':
        Contextmenu({
          event,
          menus: [
            {
              label: '打开表',
              onClick: () => {
                this.openTableInstance(data as MySqlTableInstance)
              }
            },
            {
              label: '设计表',
              disabled: true
            },
            {
              label: '新建表',
              onClick: () => {
                this.openCreateTable((data as MySqlTableInstance).databaseId)
              }
            },
            {
              label: '删除表',
              onClick: () => {
                this.deleteTable(data as MySqlTableInstance)
              }
            },
            {
              label: '清空表',
              disabled: true
            },
            {
              label: '截断表',
              disabled: true
            },
            {
              label: '复制表',
              children: [
                {
                  label: '结构和数据',
                  disabled: true
                },
                {
                  label: '仅结构',
                  disabled: true
                }
              ],
              disabled: true
            },
            {
              label: '设置权限',
              divided: true,
              disabled: true
            },
            {
              label: '导入向导',
              disabled: true
            },
            {
              label: '导出向导',
              divided: true,
              disabled: true
            },
            {
              label: '转储SQL文件',
              divided: true,
              children: [
                {
                  label: '结构和数据',
                  disabled: true
                },
                {
                  label: '仅结构',
                  disabled: true
                }
              ],
              disabled: true
            },
            {
              label: '复制',
              disabled: true
            },
            {
              label: '重命名',
              divided: true,
              disabled: true
            },
            {
              label: '刷新',
              disabled: true
            },
            {
              label: '对象信息',
              disabled: true
            }
          ]
        })
        break
      case 'view':
        TreeNodeContextmenu.view(event, data as ViewNode<ViewInstanceNode>)
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

  /**
   * 通过数据库的ID获取数据库信息
   *
   * @param databaseId   数据库ID
   * @return 数据库信息或者null
   */
  getDatabase(databaseId: number): MySqlDatabaseInstance | null {
    for (let i = 0; i < this.connection.children!.length; i++) {
      const database = this.connection.children![i] as MySqlDatabaseInstance
      if (database.id === databaseId) {
        return database
      }
    }

    return null
  }

  onClickNode(data: ConnectionTreeNode) {
    switch (data.nodeType) {
      case 'table':
        ClickNode.table(data as TableNode<MySqlTableInstance>)
        break
      case 'table_instance':
        const database = this.getDatabase((data as MySqlTableInstance).databaseId)
        database && ClickNode.table(database.children![0] as TableNode<MySqlTableInstance>)
        break
    }
  }

  // region 数据库相关操作 start //

  openCreateDatabase() {
    dynamicDialogStore.open(
      {
        title: '新建数据库',
        width: '600px',
        footerButtons: [
          {
            type: 'info',
            text: '取消',
            onClick: (): Promise<void> => {
              dynamicDialogStore.close()
              return Promise.resolve()
            }
          },
          {
            type: 'primary',
            text: '创建',
            enableLoading: true,
            loadingText: '正在创建',
            onClick: async (): Promise<void> => {
              try {
                const data = (await dynamicDialogStore.ref.onSubmit()) as MySqlDatabaseInstance
                data.sessionId = this.connection.id as number
                this.connection.children?.push(data)
                connectionStore.refreshConnectionTree()
                dynamicDialogStore.close()
                return Promise.resolve()
              } catch (e) {
                return Promise.reject((e as Error).message)
              }
            }
          }
        ]
      },
      () => import('@/components/database/mysql/dialogs/create-database.vue')
    )
  }

  openEditDatabase(data: MySqlDatabaseInstance) {
    dynamicDialogStore.open(
      {
        title: '编辑数据库',
        width: '600px',
        footerButtons: [
          {
            text: '取消',
            type: 'info',
            onClick: (): Promise<void> => {
              dynamicDialogStore.close()
              return Promise.resolve()
            }
          },
          {
            text: '保存',
            type: 'primary',
            enableLoading: true,
            loadingText: '正在保存',
            onClick: (): Promise<void> => {
              return new Promise(async (resolve, reject) => {
                try {
                  const databaseInfo = (await dynamicDialogStore.ref.onSubmit()) as MySqlDatabaseInstance
                  for (let i = 0; i < (this.connection.children?.length || 0); i++) {
                    if (this.connection.children![i].id === databaseInfo.id) {
                      this.connection.children![i] = databaseInfo
                      break
                    }
                  }
                  connectionStore.refreshConnectionTree()
                  dynamicDialogStore.close()
                  resolve()
                } catch {
                  reject()
                }
              })
            }
          }
        ],
        afterOpen: (ref: any) => {
          ref.setFormData(data)
        }
      },
      () => import('@/components/database/mysql/dialogs/create-database.vue')
    )
  }

  deleteDatabase(data: MySqlDatabaseInstance) {
    MessageBox.deleteConfirm(TextConstant.deleteConfirm(data.name), done => {
      for (let i = 0; i < this.connection.children!.length; i++) {
        if (this.connection.children![i].id === data.id) {
          this.connection.children!.splice(i, 1)
          // TODO 需要判断该数据库下有没有已经打开的work-tab
          connectionStore.refreshConnectionTree()
          break
        }
      }
      done()
    }).then()
  }

  // endregion 数据库相关操作 start //

  // region 数据表相关操作 start //

  /**
   * 打开表实例，在work-tab中添加表数据组件
   *
   * @param data  表实例信息
   */
  openTableInstance(data: MySqlTableInstance) {
    const databaseName = this.connection.children!.find(item => item.id === data.databaseId)?.name || '未知的数据库'
    const tabId = `${data.sessionId!}_${data.databaseId}_${data.id}`
    workTabStore.addTab({
      id: tabId,
      label: `表 - ${data.name} @${databaseName} (${this.connection.name})`,
      component: () => import('@/components/database/mysql/work-tabs/table-data.vue'),
      props: {
        tableInfo: data,
        workTabId: tabId
      }
    })
  }

  /**
   * 在work-tab中打开创建表
   *
   * @param databaseId  数据库ID
   */
  openCreateTable(databaseId: number) {
    const database = this.getDatabase(databaseId)
    if (!database) {
      MessageBox.error('未找到数据库信息，无法创建表，请刷新页面后再试。').then()
      return
    }
    workTabStore.addTab({
      id: `create_table_${database.sessionId}_${databaseId}`,
      label: `创建表 - 无标题 @${database.name} (${this.connection.name})`,
      component: () => import('@/components/database/mysql/work-tabs/create-table/index.vue'),
      props: {
        database
      }
    })
  }

  /**
   * 删除表
   *
   * @param data  表信息
   */
  deleteTable(data: MySqlTableInstance) {
    MessageBox.deleteConfirm(TextConstant.deleteConfirm(data.name), done => {
      // TODO 掉接口删除表，然后重新刷新列表
      data.name = 'administrative_cont_' + Date.now().toString().substring(9, 13)

      done()
      connectionStore.refreshConnectionTree()
    }).then(() => {})
  }

  // endregion 数据表相关操作 end //
}

const TreeNodeContextmenu = {
  database: (event: MouseEvent, data: MySqlDatabaseInstance, session: MySQLConnectionSession) => {
    const id = data.id as number

    const openDatabase = () => {
      data.status = 'loading'
      setTimeout(() => {
        data.children = []
        data.children.push({
          id: Date.now() + 1,
          databaseId: data.id,
          sessionId: data.sessionId,
          name: '表',
          nodeType: 'table',
          children: ['administrative_cont', 'administrative_cont_pdf', 'sys_user', 'sys_role', 'sys_user_role', 'sys_log'].map(
            (item, index) => {
              return {
                id: index + 1,
                name: item,
                databaseId: data.id,
                sessionId: data.sessionId,
                nodeType: 'table_instance',
                rowsNum: 0,
                dataLength: 16384,
                autoIncrement: 0,
                comment: '我是注释呀，哈哈哈哈' + index,
                updateTime: '2023-05-07 08:57:32',
                fields: [],
                indexes: [],
                foreignKeys: [],
                option: {
                  engine: 'InnoDB',
                  autoIncrement: 0,
                  avgRowLength: 10,
                  maxRows: 10,
                  minRows: 1,
                  keyBlockSize: 1,
                  statsSamplePages: 1,
                  encryption: false
                },
                triggers: []
              }
            }
          )
        } as TableNode<MySqlTableInstance>)
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
        } as ViewNode<ViewInstanceNode>)
        data.children.push({
          id: Date.now() + 3,
          sessionId: data.sessionId,
          name: '函数',
          nodeType: 'function',
          children: ['fun_diff_day_dur', 'fun_name_day_dur', 'proc_init_normal', 'proc_init_unusual', 'proc_leave_everyday'].map(
            (item, index) => {
              return {
                id: index + 1,
                name: item,
                sessionId: data.sessionId,
                nodeType: 'function_instance'
              }
            }
          ) as FunctionInstanceNode[]
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
        connectionStore.refreshConnectionTree()
      }, 1000)
    }

    const closeDatabase = () => {
      data.status = 'loading'
      setTimeout(() => {
        // 关闭work-tabs对象pane
        for (let i = 0; i < (data.children?.length || 0); i++) {
          const b = workTabStore.clearObjectPaneByProp(data.children![i])
          if (b) {
            break
          }
        }

        data.children = []
        data.status = 'disable'
        connectionStore.removeExpandKey(id)
        connectionStore.refreshConnectionTree()
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
          onClick: () => {
            session.openEditDatabase(data)
          }
        },
        {
          label: '新建数据库',
          onClick: () => {
            session.openCreateDatabase()
          }
        },
        {
          label: '删除数据库',
          divided: true,
          onClick: () => {
            session.deleteDatabase(data)
          }
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

  table: (event: MouseEvent, data: TableNode<MySqlTableInstance>, session: MySQLConnectionSession) => {
    Contextmenu({
      event,
      menus: [
        {
          label: '新建表',
          divided: true,
          onClick: () => {
            session.openCreateTable(data.databaseId)
          }
        },
        {
          label: '导入向导',
          disabled: true
        },
        {
          label: '导出向导',
          divided: true,
          disabled: true
        },
        {
          label: '运行SQL文件',
          disabled: true
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

  view: (event: MouseEvent, data: ViewNode<ViewInstanceNode>) => {
    console.log(data)

    Contextmenu({
      event,
      menus: [
        {
          label: '新建视图',
          divided: true,
          disabled: true
        },
        {
          label: '导出向导',
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

  viewInstance: (event: MouseEvent, data: ViewInstanceNode) => {
    console.log(data)

    Contextmenu({
      event,
      menus: [
        {
          label: '打开视图',
          disabled: true
        },
        {
          label: '设计视图',
          disabled: true
        },
        {
          label: '新建视图',
          disabled: true
        },
        {
          label: '删除视图',
          disabled: true
        },
        {
          label: '设置权限',
          divided: true,
          disabled: true
        },
        {
          label: '导出向导',
          divided: true,
          disabled: true
        },
        {
          label: '复制',
          disabled: true
        },
        {
          label: '重命名',
          divided: true,
          disabled: true
        },
        {
          label: '刷新',
          disabled: true
        },
        {
          label: '对象信息',
          disabled: true
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

  functionInstance: (event: MouseEvent, data: FunctionInstanceNode) => {
    console.log(data)

    Contextmenu({
      event,
      menus: [
        {
          label: '设计函数',
          disabled: true
        },
        {
          label: '新建函数',
          disabled: true
        },
        {
          label: '删除函数',
          disabled: true
        },
        {
          label: '运行函数',
          disabled: true
        },
        {
          label: '设置权限',
          divided: true,
          disabled: true
        },
        {
          label: '复制',
          disabled: true
        },
        {
          label: '重命名',
          divided: true,
          disabled: true
        },
        {
          label: '刷新',
          disabled: true
        },
        {
          label: '对象信息',
          disabled: true
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
          divided: true,
          disabled: true
        },
        {
          label: '打开外部查询',
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

  searchInstance: (event: MouseEvent, data: SearchInstanceNode) => {
    console.log(data)

    Contextmenu({
      event,
      menus: [
        {
          label: '设计查询',
          disabled: true
        },
        {
          label: '新建查询',
          disabled: true
        },
        {
          label: '删除查询',
          divided: true,
          disabled: true
        },
        {
          label: '导出向导',
          divided: true,
          disabled: true
        },
        {
          label: '复制',
          disabled: true
        },
        {
          label: '重命名',
          divided: true,
          disabled: true
        },
        {
          label: '刷新',
          disabled: true
        },
        {
          label: '对象信息',
          disabled: true
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
          divided: true,
          disabled: true
        },
        {
          label: '从文件中还原备份',
          disabled: true
        },
        {
          label: '从文件中提取SQL',
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

  backupInstance: (event: MouseEvent, data: BackupInstanceNode) => {
    console.log(data)

    Contextmenu({
      event,
      menus: [
        {
          label: '还原备份',
          disabled: true
        },
        {
          label: '新建备份',
          disabled: true
        },
        {
          label: '删除备份',
          divided: true,
          disabled: true
        },
        {
          label: '提取SQL',
          divided: true,
          disabled: true
        },
        {
          label: '复制',
          disabled: true
        },
        {
          label: '重命名',
          divided: true,
          disabled: true
        },
        {
          label: '刷新',
          disabled: true
        },
        {
          label: '对象信息',
          disabled: true
        }
      ]
    })
  }
}

const ClickNode = {
  table: (data: TableNode<MySqlTableInstance>) => {
    workTabStore.setObjectPane({
      props: data,
      component: () => import('@/components/database/mysql/work-tabs/object-pane/table-list.vue')
    })
  }
}
