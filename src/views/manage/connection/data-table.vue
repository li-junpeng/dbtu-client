<!--
 * 连接数据表格
 *
 * @author Junpeng.Li
 * @date 2023-06-30 22:
-->
<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElTable, ElTableColumn } from 'element-plus'
import { Delete as IconDelete, Edit as IconEdit } from '@element-plus/icons-vue'

defineOptions({
  name: 'ManageConnectionDataTablePage'
})

const connections = ref([])
for (let i = 0; i < 1; i++) {
  connections.value.push({
    id: 1,
    name: '@localhost',
    type: 'mysql',
    status: 'down',
    version: '--',
    host: 'localhost:3306'
  })
  connections.value.push({
    id: 1,
    name: '@localhost',
    type: 'sql_server_2012',
    status: 'down',
    version: '--',
    host: 'localhost:3306'
  })
}

</script>

<template>
  <div class="container">
    <el-table
      :data="connections"
      empty-text="暂无数据库连接"
      fit
      highlight-current-row
      max-height="530px"
      scrollbar-always-on
      style="width: 100%"
    >
      <el-table-column prop="name" label="连接名"/>
      <el-table-column prop="status" label="状态" align="center" width="100"/>
      <el-table-column prop="version" label="数据库版本" align="center" width="200"/>
      <el-table-column prop="host" label="主机 & 端口" align="center" width="300"/>
      <el-table-column prop="__action" label="操作" align="center" width="300">
        <template #default="{ row }">
          <el-button :icon="IconEdit" link text>修改</el-button>
          <el-button :icon="IconDelete" type="danger" link text>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
}
</style>
