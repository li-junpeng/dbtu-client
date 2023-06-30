<!--
 * 连接数据表格
 *
 * @author Junpeng.Li
 * @date 2023-06-30 22:
-->
<script setup lang="ts">
import { ref } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'

defineOptions({
  name: 'ManageConnectionDataTablePage'
})

const connections = ref([])

</script>

<template>
  <div class="container">
    <el-table
      :data="connections"
      empty-text="暂无数据库连接"
      fit
      style="width: 100%"
    >
      <el-table-column prop="name" label="连接名"/>
      <el-table-column prop="status" label="状态"/>
      <el-table-column prop="version" label="数据库版本"/>
      <el-table-column prop="host" label="主机 & 端口"/>
      <el-table-column prop="__action" label="操作"/>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
}
</style>
