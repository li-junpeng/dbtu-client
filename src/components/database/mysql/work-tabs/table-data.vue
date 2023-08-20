<!--
 * 表数据
 *
 * @author Junpeng.Li
 * @date 2023-07-26 16-53
-->
<script setup lang="ts">
import type { Column } from 'element-plus'
import { TooltipShowAfter, useComponentRef } from '@/components/element-plus/element-plus-util'
import SizerDrawer from '@/components/ui/sizer-drawer/index.vue'
import DataSortDrawer from '@/components/ui/data-sort-drawer/index.vue'
import { queryTableData } from '@/api/database/mysql-database-api'
import { MessageBox } from '@/components/element-plus/el-feedback-util'

defineExpose({
  name: 'MySQLWorkTabTableDataComponent'
})

const props = defineProps({
  workTabId: String,
  tableInfo: {
    type: Object as PropType<MySqlTableInstance>,
    required: true
  }
})
const sizerDrawerRef = useComponentRef(SizerDrawer)
const dataSortDrawerRef = useComponentRef(DataSortDrawer)
const fields = [] as string[]
// 查询条件
const whereSql = ref('')
// 排序语句
const sortSql = ref('')
const sqlExecuteResult = shallowRef<SQLExecuteResult>({
  success: false,
  executeTime: 0,
  originSql: ''
})
const isLoadData = ref(false)
const loadTableData = async () => {
  isLoadData.value = true
  const { sessionId, database, name } = props.tableInfo
  const { status, message, data } = await queryTableData({
    sessionId: sessionId!,
    databaseName: database,
    tableName: name,
    current: 1,
    page: 1000
  })
  if (status === 'success') {
    sqlExecuteResult.value = data!
  } else {
    MessageBox.error(message)
  }
  isLoadData.value = false
}

const columns = computed<Column[]>(() => {
  const _columns = sqlExecuteResult.value.queryResult?.columns || []
  const columns = [] as Column[]
  _columns.forEach(_column => {
    const name = _column.label
    columns.push({
      key: name,
      dataKey: name,
      title: name,
      width: 150
    })
    fields.push(name)
  })
  return columns
})
const tableData = computed(() => {
  return sqlExecuteResult.value.queryResult?.rows || []
})

const openSizerDrawer = () => {
  sizerDrawerRef.value?.open()
}

const openDataFilter = () => {
  dataSortDrawerRef.value?.open()
}

onMounted(() => {
  loadTableData()
})
</script>

<template>
  <div class="table-data-container">
    <!-- 头部工具栏 -->
    <div class="header-toolbox">
      <el-button
        text
        link
        @click="openSizerDrawer()"
      >
        <template #icon>
          <DIconSizer />
        </template>
        <span>筛选</span>
      </el-button>
      <el-button
        text
        link
        @click="openDataFilter()"
      >
        <template #icon>
          <DIconSort />
        </template>
        <span>排序</span>
      </el-button>
      <el-button
        text
        link
        disabled
      >
        <template #icon>
          <DIconDbImport />
        </template>
        <span>导入数据</span>
      </el-button>
      <el-button
        text
        link
        disabled
      >
        <template #icon>
          <DIconDbExport />
        </template>
        <span>导出数据</span>
      </el-button>
      <div class="button-divided"></div>
      <el-button
        text
        link
        disabled
      >
        <template #icon>
          <IconPlus />
        </template>
        <span>添加记录</span>
      </el-button>
      <el-button
        text
        link
        disabled
      >
        <template #icon>
          <IconSemiSelect />
        </template>
        <span>删除记录</span>
      </el-button>
      <el-button
        text
        link
        disabled
      >
        <template #icon>
          <IconSelect />
        </template>
        <span>应用更改</span>
      </el-button>
      <el-button
        text
        link
        disabled
      >
        <template #icon>
          <IconCloseBold />
        </template>
        <span>放弃更改</span>
      </el-button>
      <el-button
        text
        link
        :loading="isLoadData"
        @click="loadTableData"
      >
        <template #icon>
          <IconRefreshRight />
        </template>
        <span>刷新</span>
      </el-button>
    </div>
    <!-- 中间数据表格 -->
    <div class="center-table">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2
            :columns="columns"
            :data="tableData"
            :width="width"
            :height="height"
            :header-height="34"
            :row-height="34"
            fixed
            class="table-border"
          />
        </template>
      </el-auto-resizer>
    </div>
    <!-- 底部工具栏和提示栏 -->
    <div class="bottom-toolbox">
      <div>
        {{ sqlExecuteResult.originSql || '' }}
      </div>
    </div>
  </div>

  <sizer-drawer
    ref="sizerDrawerRef"
    title="数据筛选"
    :fields="fields"
    @apply-sizer="sql => (whereSql = sql)"
  />

  <data-sort-drawer
    ref="dataSortDrawerRef"
    :fields="fields"
    @apply-sort="sql => (sortSql = sql)"
  />
</template>

<style scoped lang="scss">
.button-divided {
  width: 2px;
  height: 35%;
  background-color: var(--dbtu-divide-borer-color);
  margin: 0 12px;
}
.table-data-container {
  width: 100%;
  height: 100%;

  .header-toolbox,
  .bottom-toolbox {
    width: 100%;
    height: 40px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    color: var(--dbtu-font-color);
  }

  .bottom-toolbox {
    border-top: 1px solid var(--dbtu-divide-borer-color);
    gap: 40px;
  }

  .center-table {
    width: 100%;
    height: calc(100% - 80px);
    border-left: none;
    border-right: none;
    padding: 0 10px;
  }
}
</style>
