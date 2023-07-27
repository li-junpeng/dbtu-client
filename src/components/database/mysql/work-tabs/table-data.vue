<!--
 * 表数据
 *
 * @author Junpeng.Li
 * @date 2023-07-26 16-53
-->
<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'
import type { Column } from 'element-plus'
import { ElAutoResizer, ElButton, ElTableV2, ElTooltip } from 'element-plus'
import {
  CloseBold as IconCloseBold,
  Plus as IconPlus,
  RefreshRight as IconRefreshRight,
  Select as IconSelect,
  SemiSelect as IconSemiSelect
} from '@element-plus/icons-vue'
import IconSizer from '@/icons/svg/sizer.vue'
import IconSort from '@/icons/svg/sort.vue'
import IconDbImport from '@/icons/svg/db-import.vue'
import IconDbExport from '@/icons/svg/db-export.vue'
import { TooltipShowAfter, useComponentRef } from '@/components/element-plus/elemenet-plus-util'
import MockData from '@/assets/data/mock-table-data-test.json'
import SizerDrawer from '@/components/ui/sizer-drawer/index.vue'

defineExpose({
  name: 'MySQLWorkTabTableDataComponent'
})

const props = defineProps({
  data: {
    type: Object as PropType<MySqlTableNode>,
    required: true
  }
})
const sizerDrawerRef = useComponentRef(SizerDrawer)
const fields = [] as string[]
// 查询条件
const whereSql = ref('')
const columns = computed<Column[]>(() => {
  const row = MockData.RECORDS[0]
  const columns = []
  for (let key in row) {
    columns.push({
      key,
      dataKey: key,
      title: key,
      width: 150
    })
    fields.push(key)
  }
  return columns
})
const tableData = computed(() => {
  return MockData.RECORDS
})

const openSizerDrawer = () => {
  sizerDrawerRef.value?.open()
}

</script>

<template>
  <div class="table-data-container">
    <!-- 头部工具栏 -->
    <div class="header-toolbox">
      <el-button text link :icon="IconSizer" @click="openSizerDrawer()">
        <span>筛选</span>
      </el-button>
      <el-button text link :icon="IconSort" disabled>
        <span>排序</span>
      </el-button>
      <el-button text link :icon="IconDbImport" disabled>
        <span>导入数据</span>
      </el-button>
      <el-button text link :icon="IconDbExport" disabled>
        <span>导出数据</span>
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
        <el-tooltip
          content="添加记录"
          :enterable="false"
          :show-after="TooltipShowAfter"
        >
          <el-button :icon="IconPlus" text link disabled></el-button>
        </el-tooltip>
        <el-tooltip
          content="删除记录"
          :enterable="false"
          :show-after="TooltipShowAfter"
        >
          <el-button :icon="IconSemiSelect" text link disabled></el-button>
        </el-tooltip>
        <el-tooltip
          content="应用更改"
          :enterable="false"
          :show-after="TooltipShowAfter"
        >
          <el-button :icon="IconSelect" text link disabled></el-button>
        </el-tooltip>
        <el-tooltip
          content="放弃更改"
          :enterable="false"
          :show-after="TooltipShowAfter"
        >
          <el-button :icon="IconCloseBold" text link disabled></el-button>
        </el-tooltip>
        <el-tooltip
          content="刷新"
          :enterable="false"
          :show-after="TooltipShowAfter"
        >
          <el-button :icon="IconRefreshRight" text link></el-button>
        </el-tooltip>
      </div>
    </div>
  </div>

  <sizer-drawer
    ref="sizerDrawerRef"
    title="数据筛选"
    :fields="fields"
    @apply-sizer="sql => whereSql = sql"
  />
</template>

<style scoped lang="scss">
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
