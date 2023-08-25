<!--
 * 数据表格测试
 *
 * @author HuaYu
 * @date 2023-08-25 14:03
-->
<script setup lang="ts">
import DataGrid, { type TableColumn } from '@/components/ui/data-grid'

defineOptions({
  name: 'name'
})

const columns = [
  {
    key: 'id',
    label: 'id',
    dataType: 'number'
  },
  {
    key: 'name',
    label: 'name',
    width: 150,
    dataType: 'string'
  }
] as TableColumn[]
const data = reactive([])
</script>

<template>
  <div class="test-container">
    <DataGrid
      :columns="columns"
      :data="data"
    />
  </div>
</template>

<style scoped lang="scss">
.test-container {
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
