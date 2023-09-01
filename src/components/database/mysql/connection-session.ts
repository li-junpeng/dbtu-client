import type { ConnectionSession } from '@/components/database/connection-session'
import Contextmenu from '@/components/ui/contextmenu/src/contextmenu-install'
import { useConnectionStore } from '@/stores/ConnectionStore'
import { useWorkTabStore } from '@/stores/WorkTabStore'
import { useDynamicDialogStore } from '@/stores/DynamicDialogStore'
import { Message, MessageBox } from '@/components/element-plus/el-feedback-util'
import { TextConstant } from '@/common/constants/TextConstant'
import { openConnection, closeConnection, refreshConnection } from '@/api/connection-api'
import { deleteDatabase, getDatabaseObject, deleteTable, queryTableList } from '@/api/database/mysql-database-api'

const connectionStore = useConnectionStore()
const workTabStore = useWorkTabStore()
const dynamicDialogStore = useDynamicDialogStore()

export class MySQLConnectionSession implements ConnectionSession<MySQLConnectionInfo> {
  connection: ConnectionInfo<MySQLConnectionInfo>

  constructor(data: ConnectionInfo<MySQLConnectionInfo>) {
    this.connection = data
  }

  async open(): Promise<void> {
    const { data, status, message } = await openConnection<{
      data: MySqlDatabaseInstance[]
      sessionId: number
    }>(this.connection)
    if (status === 'success') {
      const databases = data?.data || []
      databases.forEach(item => (item.status = 'disable'))
      this.connection.children = databases || []
      this.connection.sessionId = data?.sessionId
      return Promise.resolve()
    }
    return Promise.reject(message)
  }

  async close(): Promise<void> {
    const { status, message } = await closeConnection(this.connection.sessionId!)
    if (status === 'success') {
      this.connection.children = []
      return Promise.resolve()
    }
    return Promise.reject(message)
  }

  async refresh(): Promise<void> {
    const { status, message, data } = await refreshConnection<MySqlDatabaseInstance[]>(this.connection)
    if (status === 'success') {
      const oldDatabases = (this.connection.children as MySqlDatabaseInstance[]) || []
      const newDatabases = data || []
      for (let i = oldDatabases.length - 1; i >= 0; i--) {
        let isDel = true
        for (let j = newDatabases.length - 1; j >= 0; j--) {
          if (oldDatabases[i].name === newDatabases[j].name) {
            isDel = false
            newDatabases.splice(j, 1)
            break
          }
        }
        if (isDel) {
          workTabStore.closeByStr(oldDatabases[i].name, 'database')
          oldDatabases.splice(i, 1)
        }
      }
      newDatabases.forEach(item => {
        item.status = 'disable'
        oldDatabases.push(item)
      })
      oldDatabases.sort((item1, item2) => item1.name.localeCompare(item2.name))

      return Promise.resolve()
    } else {
      return Promise.reject(message)
    }
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
                this.openCreateTable((data as MySqlTableInstance).database)
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
        TreeNodeContextmenu.function(event, data as FunctionNode<FunctionInstanceNode>)
        break
      case 'function_instance':
        TreeNodeContextmenu.functionInstance(event, data as FunctionInstanceNode)
        break
      case 'search':
        TreeNodeContextmenu.search(event, data as SearchNode<SearchInstanceNode>)
        break
      case 'search_instance':
        TreeNodeContextmenu.searchInstance(event, data as SearchInstanceNode)
        break
      case 'backup':
        TreeNodeContextmenu.backup(event, data as BackupNode<BackupInstanceNode>)
        break
      case 'backup_instance':
        TreeNodeContextmenu.backupInstance(event, data as BackupInstanceNode)
        break
    }
  }

  /**
   * 通过数据库的ID获取数据库信息
   *
   * @param databaseName   数据库名称
   * @return 数据库信息或者null
   */
  getDatabase(databaseName: string): MySqlDatabaseInstance | null {
    for (let i = 0; i < this.connection.children!.length; i++) {
      const database = this.connection.children![i] as MySqlDatabaseInstance
      if (database.name === databaseName) {
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
        const database = this.getDatabase((data as MySqlTableInstance).database)
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
        props: {
          connection: this.connection
        },
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
                data.status = 'disable'
                data.sessionId = this.connection.id as number
                if (!this.connection.children) {
                  this.connection.children = []
                }
                this.connection.children.push(data)
                // 按数据库名称排序
                this.connection.children.sort((item1, item2) => item1.name.localeCompare(item2.name))
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
        props: {
          connection: this.connection
        },
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
    MessageBox.deleteConfirm(TextConstant.deleteConfirm(data.name), async done => {
      const { status, message } = await deleteDatabase(data.sessionId!, data.name)
      if (status === 'success') {
        for (let i = 0; i < this.connection.children!.length; i++) {
          if (this.connection.children![i].id === data.id) {
            // 关闭对应的work-tab
            workTabStore.closeByStr(data.name, 'database')
            
            this.connection.children!.splice(i, 1)
            // TODO 需要判断该数据库下有没有已经打开的work-tab
            connectionStore.refreshConnectionTree()
            break
          }
        }
        Message.success(message)
      } else {
        MessageBox.error(message)
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
    const tabId = workTabStore.generateId('queryTable', data.sessionId!, [data.database, data.id!])
    workTabStore.addTab(
      {
        id: tabId,
        label: `表 - ${data.name} @${data.database} (${this.connection.name})`,
        component: () => import('@/components/database/mysql/work-tabs/table-data.vue')
      },
      {
        tableInfo: data
      }
    )
  }

  /**
   * 在work-tab中打开创建表
   *
   * @param databaseName  数据库名
   */
  openCreateTable(databaseName: string) {
    const database = this.getDatabase(databaseName)
    if (!database) {
      MessageBox.error('未找到数据库信息，无法创建表，请刷新页面后再试。').then()
      return
    }
    workTabStore.addTab(
      {
        id: workTabStore.generateId('createTable', database.sessionId!, [databaseName]),
        label: `创建表 - 无标题 @${database.name} (${this.connection.name})`,
        component: () => import('@/components/database/mysql/work-tabs/create-table/index.vue')
      },
      {
        database
      }
    )
  }

  /**
   * 加载指定数据库下的表信息
   *
   * @param databaseName 数据库名
   */
  async loadTable(databaseName: string) {
    const database = this.getDatabase(databaseName)
    // 可能数据库处于关闭状态
    if (!database || !database.children) {
      return
    }

    const { status, message, data } = await queryTableList(this.connection.sessionId!, databaseName)
    if (status === 'success') {
      for (let i = 0; i < database.children.length; i++) {
        if (database.children[i].nodeType === 'table') {
          ;(database.children[i] as TableNode<MySqlTableInstance>).children = data!
          connectionStore.refreshConnectionTree()
          break
        }
      }
    } else {
      MessageBox.error(message)
    }
  }

  /**
   * 删除表
   *
   * @param data  表信息
   */
  deleteTable(data: MySqlTableInstance) {
    MessageBox.deleteConfirm(TextConstant.deleteConfirm(data.name), async done => {
      const { status, message } = await deleteTable(data.sessionId!, data.database, data.name)
      if (status === 'success') {
        this.loadTable(data.database)
        Message.success(message)
      } else {
        MessageBox.error(message)
      }

      done()
    }).then(() => {})
  }

  // endregion 数据表相关操作 end //
}

const TreeNodeContextmenu = {
  database: (event: MouseEvent, data: MySqlDatabaseInstance, session: MySQLConnectionSession) => {
    const databaseId = data.id as number

    const openDatabase = async () => {
      data.children = []
      data.status = 'loading'
      const response = await getDatabaseObject(data.sessionId!, data.name)
      if (response.status === 'fail') {
        data.status = 'disable'
        MessageBox.error(response.message)
      } else {
        data.children.push({
          id: Date.now() + 1,
          database: data.name,
          sessionId: data.sessionId,
          name: '表',
          nodeType: 'table',
          children: response.data?.tables || []
        } as TableNode<MySqlTableInstance>)
        data.children.push({
          id: Date.now() + 2,
          database: data.name,
          sessionId: data.sessionId,
          name: '视图',
          nodeType: 'view',
          children: response.data?.views || []
        } as ViewNode<MySqlViewInstance>)
        data.children.push({
          id: Date.now() + 3,
          database: data.name,
          sessionId: data.sessionId,
          name: '函数',
          nodeType: 'function',
          children: response.data?.functions || []
        } as FunctionNode<MySqlFunctionInstance>)
        data.children.push({
          id: Date.now() + 4,
          database: data.name,
          sessionId: data.sessionId,
          name: '查询',
          nodeType: 'search',
          children: []
        } as SearchNode<SearchInstanceNode>)
        data.children.push({
          id: Date.now() + 5,
          database: data.name,
          sessionId: data.sessionId,
          name: '备份',
          nodeType: 'backup',
          children: []
        } as BackupNode<BackupInstanceNode>)

        data.status = 'enable'
        connectionStore.setExpandKey(databaseId)
        connectionStore.refreshConnectionTree()
      }
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

        // 关闭与该数据库有关系的work-tabs
        workTabStore.closeTabsBySessionId(data.sessionId)

        data.children = []
        data.status = 'disable'
        connectionStore.removeExpandKey(databaseId)
        connectionStore.refreshConnectionTree()
      }, 100)
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
            session.openCreateTable(data.database)
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
          onClick: () => {
            session.loadTable(data.database)
          }
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

  function: (event: MouseEvent, data: FunctionNode<FunctionInstanceNode>) => {
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

  search: (event: MouseEvent, data: SearchNode<SearchInstanceNode>) => {
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

  backup: (event: MouseEvent, data: BackupNode<BackupInstanceNode>) => {
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
    workTabStore.setObjectPane(data, 'MYSQL_TABLE_LIST')
  }
}
