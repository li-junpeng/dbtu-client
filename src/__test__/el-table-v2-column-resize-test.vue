<!--
 * el-table-v2列可拖拽的功能
 *
 * @author HuaYu
 * @date 2023-08-31 15:21
-->
<script setup lang="ts">
import DataGrid, { type DataGridColumn } from '@/components/ui/data-grid'
import { reactive } from 'vue';

defineOptions({
  name: 'ElTableV2ColumnResizeTest'
})

const columns = reactive([
  {
    key: 'id',
    label: 'id',
    dataType: 'number'
  },
  {
    key: 'name',
    label: '姓名',
    dataType: 'string'
  },
  {
    key: 'age',
    label: 'age',
    dataType: 'number'
  },
  {
    key: 'sex',
    label: 'sex',
    dataType: 'string'
  },
  {
    key:  'birthday',
    label: 'birthday',
    dataType: 'string'
  }
] as DataGridColumn[]) 

const data = reactive([
  {
    id: 1,
    name: '张三',
    age: 12,
    sex: '男',
    birthday: '1990-01-01',
  }
])
</script>

<template>
  <div style="width: 100%;height: 100%;padding: 100px 200px;">
    <DataGrid :columns="columns" :data="data" />
  </div>
</template>

<style scoped lang="scss"></style>
