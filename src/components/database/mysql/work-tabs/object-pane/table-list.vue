<!--
 * MySQL 数据表列表 tab pane
 *
 * @author Junpeng.Li
 * @date 2023-07-21 11-16
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { type ObjectPaneProps } from '@/views/manage/connection/work-tabs/object-pane'
import { type Column, ElAutoResizer, ElButton, ElIcon, ElTableV2, type RowClassNameGetter } from 'element-plus'
import {
  CirclePlus as IconCirclePlus,
  Delete as IconDelete,
  EditPen as IconEditPen,
  FolderOpened as IconFolderOpened
} from '@element-plus/icons-vue'
import IconDbImport from '@/icons/svg/db-import.vue'
import IconDbExport from '@/icons/svg/db-export.vue'
import IconTable from '@/icons/svg/table.vue'
import { StringUtils } from '@/common/utils/StringUtils'
import type { RowEventHandlerParams, RowEventHandlers } from 'element-plus/es/components/table-v2/src/row'
import { useConnectionSessionStore } from '@/stores/ConnectionSessionStroe'
import type { MySQLConnectionSession } from '@/components/database/mysql/connection-session'
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
    width: 100
  },
  {
    key: 'comment',
    dataKey: 'comment',
    title: '注释',
    width: 400
  }
] as Column[]
const selectedRow = ref<MySqlInstanceNode | null>(null)

// 连接会话
const connectionSessionStore = useConnectionSessionStore()
const connectionSession = connectionSessionStore.get(props.data.sessionId!) as MySQLConnectionSession

// 表格数据
const tableData = computed<MySqlInstanceNode[]>(() => {
  return (props.data.children || []) as MySqlInstanceNode[]
})

// 表格的事件
const tableRowEvents: RowEventHandlers = {
  'onClick'(params: RowEventHandlerParams) {
    selectedRow.value = params.rowData
    params.event.stopPropagation()
  },
  'onContextmenu'(params: RowEventHandlerParams) {
    selectedRow.value = params.rowData
    connectionSession.nodeContextmenu(params.event as MouseEvent, params.rowData)
    params.event.preventDefault()
    params.event.stopPropagation()
  }
}

// 表格行的样式
const tableRowClass = ({ rowData }: Parameters<RowClassNameGetter<any>>[0]) => {
  return (rowData as MySqlInstanceNode).id === selectedRow.value?.id
    ? 'is-selected'
    : ''
}

const paneContextmenu = (event: MouseEvent) => {
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
}
</script>

<template>
  <!-- 头部工具栏 -->
  <div class="header-toolbox">
    <el-button
      text
      link
      :icon="IconFolderOpened"
      :disabled="!selectedRow"
    >
      <span>打开表</span>
    </el-button>
    <el-button
      text
      link
      :icon="IconEditPen"
      :disabled="!selectedRow"
    >
      <span>设计表</span>
    </el-button>
    <el-button
      text
      link
      :icon="IconCirclePlus"
    >
      <span>新建表</span>
    </el-button>
    <el-button
      text
      link
      :icon="IconDelete"
      :disabled="!selectedRow"
      @click="connectionSession.deleteTable(selectedRow!)"
    >
      <span>删除表</span>
    </el-button>
    <el-button
      text
      link
      :icon="IconDbImport"
    >
      <span>导入向导</span>
    </el-button>
    <el-button
      text
      link
      :icon="IconDbExport"
    >
      <span>导出向导</span>
    </el-button>
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
                <IconTable/>
              </el-icon>
              <span>{{ rowData[column.key] }}</span>
            </div>
            <span v-else>{{ rowData[column.key] }}</span>
          </template>
          <template #empty>
            <span
              style="color: var(--dbtu-font-color-disabled);width: 100%;height: 500px;display: flex;justify-content: center;align-items: center;">暂无数据</span>
          </template>
        </el-table-v2>
      </template>
    </el-auto-resizer>
  </div>
</template>
