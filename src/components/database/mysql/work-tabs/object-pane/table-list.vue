<!--
 * MySQL 数据表列表 tab pane
 *
 * @author Junpeng.Li
 * @date 2023-07-21 11-16
-->
<script setup lang="ts">
import type { ObjectPaneProps } from '@/views/manage/connection/work-tabs/object-pane'
import type {
  RowEventHandlerParams,
  RowEventHandlers
} from 'element-plus/es/components/table-v2/src/row'
import type { Column, RowClassNameGetter } from 'element-plus'
import type { MySQLConnectionSession } from '@/components/database/mysql/connection-session'
import { useConnectionSessionStore } from '@/stores/ConnectionSessionStore'
import { StringUtils } from '@/common/utils/StringUtils'
import Contextmenu from '@/components/ui/contextmenu'

defineOptions({
  name: 'MySQLWorkTabObjectPaneComponent'
})

const props = defineProps<ObjectPaneProps<TableNode>>()
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
    align: 'right'
  },
  {
    key: 'updateTime',
    dataKey: 'updateTime',
    title: '修改日期',
    width: 190
  },
  {
    key: 'dataLength',
    dataKey: 'dataLength',
    title: '数据长度',
    width: 100,
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
    align: 'right'
  },
  {
    key: 'comment',
    dataKey: 'comment',
    title: '注释',
    width: 400
  }
] as Column[]
const selectedRow = ref<MySqlTableNode | null>(null)
const searchName = ref('')
// 连接会话
const connectionSessionStore = useConnectionSessionStore()
const connectionSession = connectionSessionStore.get(
  props.data.sessionId!
) as MySQLConnectionSession

// 表格数据
const tableData = computed<MySqlTableNode[]>(() => {
  const array = (props.data.children || []) as MySqlTableNode[]
  if (StringUtils.isEmpty(searchName.value)) {
    return array
  }
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
    connectionSession.nodeContextmenu(params.event as MouseEvent, params.rowData)
    params.event.preventDefault()
    params.event.stopPropagation()
  }
}

// 表格行的样式
const tableRowClass = ({ rowData }: Parameters<RowClassNameGetter<any>>[0]) => {
  return (rowData as MySqlTableNode).id === selectedRow.value?.id ? 'is-selected' : ''
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
}

const openTable = () => {
  selectedRow.value && connectionSession.openTableInstance(selectedRow.value)
}
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
        @click="connectionSession.deleteTable(selectedRow!)"
      >
        <template #icon>
          <IconDelete />
        </template>
        <span>删除表</span>
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
</template>

<style scoped lang="scss">
.header-toolbox {
  justify-content: space-between;
}
</style>
@/stores/ConnectionSessionStore