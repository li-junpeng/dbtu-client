<!--
 * 字段
 *
 * @author Junpeng.Li
 * @date 2023-07-29 22:12
-->
<script setup lang="ts">
import { MySQLDataType } from '@/common/constants/DataTypeConstant'
import type { TableField } from '@/components/database/mysql/work-tabs/create-table/index'
import { ArrayUtils } from '@/common/utils/ArrayUtils'

defineOptions({
  name: 'MySQLCreateTableTabPaneComponent'
})

const selectedRow = ref<TableField | null>(null)
const tableData = reactive<TableField[]>([])

const onClickRow = (row: TableField) => {
  selectedRow.value = row
}

// 当字段信息改变时，处理字段信息
const handleField = (row: TableField) => {
  if (row.pk) {
    row.notNull = 1
  }
}

/**
 * 添加字段
 *
 * @param index  指定索引
 */
const addField = (index?: number) => {
  const data = {
    id: Date.now(),
    field: '',
    dataType: '',
    notNull: 0,
    virtual: 0,
    comment: '',
    pk: false,
    decimalPoint: 0
  } as TableField
  if (index === 0) {
    index = 1
  }
  if (index === undefined) {
    tableData.push(data)
  } else {
    tableData.splice(index, 0, data)
  }
}

// 删除字段
const deleteField = () => {
  if (!selectedRow.value) {
    return
  }
  const b = ArrayUtils.remove(tableData, selectedRow.value.id, 'id')
  if (b && tableData.length === 0) {
    addField()
  }
  selectedRow.value = tableData[0]
}

// 插入字段
const appendField = () => {
  if (!selectedRow.value) {
    return
  }
  const index = ArrayUtils.indexOf(tableData, selectedRow.value.id, 'id')
  if (index < 0) {
    return
  }
  addField(index)
}

/**
 * 修改主键状态
 *
 * @param row  如果不指定字段，则默认以当前选择的字段为准
 */
const triggerPrimaryKey = (row?: TableField) => {
  if (row) {
    row.pk = !row.pk
    handleField(row)
  } else {
    if (!selectedRow.value) {
      return
    }
    selectedRow.value.pk = !selectedRow.value.pk
    handleField(selectedRow.value)
  }
}

defineExpose({
  addField,
  deleteField,
  appendField,
  triggerPrimaryKey
})

onMounted(() => {
  addField()
  selectedRow.value = tableData[0]
})
</script>

<template>
  <div class="top-form">
    <el-table
      :data="tableData"
      border
      class="el-table-editable"
      height="390px"
      row-key="id"
      highlight-current-row
      :current-row-key="selectedRow?.id"
      @row-click="onClickRow"
    >
      <el-table-column type="index" width="50">
        <template #default="{ row, $index }">
          <span
            class="dbtu-un-user-select"
            style="padding: 0 12px;">{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字段名" prop="field" width="300px">
        <template #default="{ row }">
          <el-input v-model="row.field" maxlength="100"/>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="dataType" width="180px">
        <template #default="{ row }">
          <el-select
            v-model="row.dataType"
            placeholder=" "
            clearable
            filterable
          >
            <el-option
              v-for="key in Object.keys(MySQLDataType)"
              :key="key"
              :value="key"
              :label="key"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="长度" prop="maxLength" width="140px">
        <template #default="{ row }">
          <el-input-number
            v-model="row.maxLength"
            :controls="false"
            :min="0"
            class="el-input-number__text-left"
            style="width: 100%;"
          />
        </template>
      </el-table-column>
      <el-table-column label="小数点" prop="decimalPoint" width="140px">
        <template #default="{ row }">
          <el-input-number
            v-model="row.decimalPoint"
            :controls="false"
            :min="0"
            class="el-input-number__text-left"
            style="width: 100%;"
          />
        </template>
      </el-table-column>
      <el-table-column label="不是null" prop="notNull" width="80px" align="center">
        <template #default="{ row }">
          <el-checkbox
            v-model="row.notNull"
            :true-label="1"
            :false-label="0"
          />
        </template>
      </el-table-column>
      <el-table-column label="虚拟" prop="virtual" width="80px" align="center">
        <template #default="{ row }">
          <el-checkbox
            v-model="row.virtual"
            :true-label="1"
            :false-label="0"
          />
        </template>
      </el-table-column>
      <el-table-column label="主键" prop="pk" width="80px" align="center">
        <template #default="{ row }">
          <div
            @click="triggerPrimaryKey(row)"
            style="width: 80px;height: 35px;cursor: pointer;color: var(--dbtu-theme-color);display: flex;align-items: center;justify-content: center;line-height: 34px;gap: var(--dbtu-icon-text-gap);"
          >
            <el-icon v-if="row.pk">
              <IconKey/>
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="注释" prop="comment">
        <template #default="{ row }">
          <el-input
            v-model="row.comment"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="bottom-field-option">

  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css-style/el-table-editable";

.top-form {
  width: 100%;
  height: 400px;
}

.bottom-field-option {
  width: 100%;
  height: calc(100% - 400px);
  border-top: 1px solid var(--dbtu-divide-borer-color);
}

:deep(.el-table) {
  .el-table__body tr.current-row > td.el-table__cell {
    background-color: var(--dbtu-theme-hover-color);
    color: var(--el-color-white);
  }

  .el-table__body tr.current-row > td.el-table__cell:not(:first-child) {
    background-color: transparent;
  }

  &.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell:not(:first-child),
  &.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell:not(:first-child) {
    background-color: transparent;
  }

  .row-readonly-text {
    padding: 0 11px;
    line-height: 34px;
  }
}
</style>
