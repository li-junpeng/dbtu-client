<!--
 * 字段
 *
 * @author Junpeng.Li
 * @date 2023-07-29 22:
-->
<script setup lang="ts">
import { MySQLDataType } from '@/common/constants/DataTypeConstant'

defineOptions({
  name: 'MySQLCreateTableTabPaneComponent'
})

const tableData = reactive([{
  field: '',
  dataType: '',
  maxLength: null,
  decimalPoint: null,
  notNull: 0,
  virtual: 0,
  fk: null,
  comment: ''
},{
  field: '',
  dataType: '',
  maxLength: null,
  decimalPoint: null,
  notNull: 0,
  virtual: 0,
  fk: null,
  comment: ''
}])
</script>

<template>
  <div class="top-form">
    <el-table
      :data="tableData"
      border
      class="el-table-editable"
    >
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
              v-for="(item, key) in MySQLDataType"
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
      <el-table-column label="键" prop="pk" width="80px">
        <template #default="{ row }">

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
</style>
