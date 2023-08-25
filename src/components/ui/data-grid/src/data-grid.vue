<!--
 * 数据表格组件, 适用于数据展示, 包含编辑表格, 自适应父级元素的高度和宽度
 *
 * @author HuaYu
 * @date 2023-08-25 14:02
-->
<script setup lang="ts">
import { ref, type CSSProperties } from 'vue'
import type { DataGridProp } from './data-grid'
import type { Column as ElTableColumn } from 'element-plus'

defineOptions({
  name: 'DataGridComponent'
})

const props = withDefaults(defineProps<DataGridProp>(), {
  indexColumn: true,
  indexColumnTitle: '',
  appendNoneData: true,
  noneDataValue: '(N/A)'
})

const isNoneData = ref(false)

// 表字段
const columns = ref<ElTableColumn[]>([])

/**
 * 创建表字段
 */
const createTableColumn = () => {
  const array = [] as ElTableColumn[]

  // 序号列
  if (props.indexColumn) {
    array.push({
      key: '__dbtu__table__column__index',
      dataKey: '__dbtu__table__column__index',
      title: props.indexColumnTitle,
      width: 60,
      align: 'center',
      cellRenderer: ({ rowIndex }) => {
        return h(
          'span',
          {
            style: {
              color: 'var(--dbtu-font-color)',
              cursor: 'default',
              userSelect: 'none'
            } as CSSProperties
          },
          rowIndex + 1
        )
      }
    })
  }

  props.columns.forEach(item => {
    array.push({
      key: item.key,
      dataKey: item.key,
      title: item.label,
      width: item.dataType === 'string' ? 300 : 150
    })
  })

  columns.value = array
}

// 表格数据
const tableData = computed(() => {
  const rows = props.data || []
  if (rows.length >= 1) {
    isNoneData.value = false
    return rows
  } else {
    isNoneData.value = true
    return [createEmptyData()]
  }
})

/**
 * 创建空数据行
 */
const createEmptyData = () => {
  if (!props.appendNoneData) {
    return []
  }

  const row = {} as Record<string, any>
  columns.value.forEach(item => {
    row[item.key] = props.noneDataValue
  })
  return row
}

onMounted(() => {
  createTableColumn()
})
</script>

<template>
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
        :class="{
          'is-none-data': isNoneData
        }"
      />
    </template>
  </el-auto-resizer>
</template>

<style scoped lang="scss">
:deep(.el-table-v2) {
  &.is-none-data {
    &:not(.is-dynamic) .el-table-v2__cell-text {
      color: var(--dbtu-font-color-disabled);
      user-select: none;
    }
  }
}
</style>
