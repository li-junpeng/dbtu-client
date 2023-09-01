<!--
 * MySQL 数据表列表 tab pane
 *
 * @author Junpeng.Li
 * @date 2023-07-21 11-16
-->
<script setup lang="ts">
import type { ObjectPaneProps } from '@/views/manage/connection/work-tabs/object-pane'
import type { RowEventHandlerParams, RowEventHandlers } from 'element-plus/es/components/table-v2/src/row'
import type { Column, RowClassNameGetter } from 'element-plus'
import type { MySQLConnectionSession } from '@/components/database/mysql/connection-session'
import { useConnectionSessionStore } from '@/stores/ConnectionSessionStore'
import { StringUtils } from '@/common/utils/StringUtils'
import Contextmenu from '@/components/ui/contextmenu'
import { DateUtil } from '@/common/utils/DateUtil'

defineOptions({
  name: 'MySQLWorkTabObjectPaneComponent'
})

const props = defineProps<ObjectPaneProps<TableNode<MySqlTableInstance>>>()
const columns = [
  {
    key: 'name',
    dataKey: 'name',
    title: '表名',
    width: 400
  },
  {
    key: 'autoIncrement',
    dataKey: 'autoIncrement',
    title: '自动递增值',
    width: 150,
    align: 'right',
    cellRenderer: ({ cellData }) => {
      return cellData || 0
    }
  },
  {
    key: 'updateTime',
    dataKey: 'updateTime',
    title: '修改日期',
    width: 190,
    cellRenderer: ({ cellData }) => {
      return cellData ? DateUtil.timestamp2Str(cellData) : ''
    }
  },
  {
    key: 'dataLength',
    dataKey: 'dataLength',
    title: '数据长度',
    width: 130,
    align: 'right',
    cellRenderer: ({ cellData }) => {
      return StringUtils.formatFileSize(cellData)
    }
  },
  {
    key: 'engine',
    dataKey: 'engine',
    title: '引擎',
    width: 100
  },
  {
    key: 'rowsNum',
    dataKey: 'rowsNum',
    title: '行',
    width: 100,
    align: 'right',
    cellRenderer: ({ cellData }) => {
      return cellData || 0
    }
  },
  {
    key: 'comment',
    dataKey: 'comment',
    title: '注释',
    width: 400
  }
] as Column[]
const selectedRow = ref<MySqlTableInstance | null>(null)
const searchName = ref('')
// 连接会话
const connectionSessionStore = useConnectionSessionStore()
const getConnectionSession = () => {
  return connectionSessionStore.get(props.data.sessionId!) as MySQLConnectionSession
}

// 表格数据
const tableData = computed<MySqlTableInstance[]>(() => {
  selectedRow.value = null

  const session = getConnectionSession()
  if (!session) return []

  const database = session.connection.children?.find(item => item.name === props.data.database) as MySqlDatabaseInstance
  if (!database) return []

  const tableNode = database.children?.find(item => item.nodeType === 'table')
  if (!tableNode) return []
  
  const array = (tableNode.children || []) as MySqlTableInstance[]
  if (StringUtils.isEmpty(searchName.value)) {
    return array
  }

  selectedRow.value = null
  return array.filter(item => item.name.indexOf(searchName.value) >= 0)
})

// 表格的事件
const tableRowEvents: RowEventHandlers = {
  onClick(params: RowEventHandlerParams) {
    selectedRow.value = params.rowData
    params.event.stopPropagation()
  },
  onContextmenu(params: RowEventHandlerParams) {
    selectedRow.value = params.rowData
    getConnectionSession().nodeContextmenu(params.event as MouseEvent, params.rowData)
    params.event.preventDefault()
    params.event.stopPropagation()
  }
}

// 表格行的样式
const tableRowClass = ({ rowData }: Parameters<RowClassNameGetter<any>>[0]) => {
  return (rowData as MySqlTableInstance).id === selectedRow.value?.id ? 'is-selected' : ''
}

// 打开创建表work-tab
const toCreateTable = () => {
  getConnectionSession().openCreateTable(props.data.database)
}

// 正在刷新表
const isRefresh = ref(false)
// 刷新表
const refreshTable = async () => {
  isRefresh.value = true
  await getConnectionSession().loadTable(props.data.database)
  isRefresh.value = false
}

const paneContextmenu = (event: MouseEvent) => {
  // 清空选择的表
  selectedRow.value = null

  Contextmenu({
    event,
    menus: [
      {
        label: '新建表',
        divided: true,
        onClick: () => {
          toCreateTable()
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
          refreshTable()
        }
      }
    ]
  })
}

const openTable = () => {
  selectedRow.value && getConnectionSession().openTableInstance(selectedRow.value)
}

const bottomText = computed(() => {
  let text = `${props.data.children?.length || 0} 个表`

  if (props.data.children?.length !== tableData.value.length) {
    text += `, 筛选 ${tableData.value.length} 个表`
  }

  if (selectedRow.value) {
    text += `, 当前选中 ${selectedRow.value.name}`
  }

  return text
})
</script>

<template>
  <!-- 头部工具栏 -->
  <div class="header-toolbox">
    <div>
      <el-button
        text
        link
        :disabled="!selectedRow"
        @click="openTable"
      >
        <template #icon>
          <IconFolderOpened />
        </template>
        <span>打开表</span>
      </el-button>
      <el-button
        text
        link
        :disabled="!selectedRow"
      >
        <template #icon>
          <IconEditPen />
        </template>
        <span>设计表</span>
      </el-button>
      <el-button
        text
        link
        @click="toCreateTable"
      >
        <template #icon>
          <IconCirclePlus />
        </template>
        <span>新建表</span>
      </el-button>
      <el-button
        text
        link
        :disabled="!selectedRow"
        @click="getConnectionSession().dropTable(selectedRow!)"
      >
        <template #icon>
          <IconDelete />
        </template>
        <span>删除表</span>
      </el-button>
      <el-button
        text
        link
        :loading="isRefresh"
        @click="refreshTable"
      >
        <template #icon>
          <IconRefresh />
        </template>
        <span>刷新表</span>
      </el-button>
      <el-button
        text
        link
      >
        <template #icon>
          <DIconDbImport />
        </template>
        <span>导入向导</span>
      </el-button>
      <el-button
        text
        link
      >
        <template #icon>
          <DIconDbExport />
        </template>
        <span>导出向导</span>
      </el-button>
    </div>
    <el-input
      v-model="searchName"
      clearable
      style="width: 300px"
      placeholder="输入表名查询"
    >
      <template #prefix>
        <el-icon>
          <IconSearch />
        </el-icon>
      </template>
    </el-input>
  </div>
  <!-- 数据列表 -->
  <div class="table-list-wrapper">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2
          row-key="id"
          :columns="columns"
          :data="tableData"
          :width="width"
          :height="height"
          :header-height="34"
          :row-height="34"
          :row-event-handlers="tableRowEvents"
          :row-class="tableRowClass"
          fixed
          class="table-list-v2"
          @click.stop="selectedRow = null"
          @contextmenu.prevent="paneContextmenu($event)"
        >
          <template #cell="{ column, rowData }">
            <div
              v-if="column.key === 'name'"
              class="table-name-cell"
            >
              <el-icon>
                <DIconTable />
              </el-icon>
              <span>{{ rowData[column.key] }}</span>
            </div>
            <span v-else>{{ rowData[column.key] }}</span>
          </template>
          <template #empty>
            <span
              style="
                color: var(--dbtu-font-color-disabled);
                width: 100%;
                height: 500px;
                display: flex;
                justify-content: center;
                align-items: center;
              "
              >暂无数据</span
            >
          </template>
        </el-table-v2>
      </template>
    </el-auto-resizer>
  </div>

  <!-- 底部提示栏 -->
  <div class="bottom-tip">
    {{ bottomText }}
  </div>
</template>

<style scoped lang="scss">
.header-toolbox {
  justify-content: space-between;
}
</style>
