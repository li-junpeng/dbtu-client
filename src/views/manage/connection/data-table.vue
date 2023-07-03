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
import { useComponentRef } from '@/components/element-plus/elemenet-plus-util'
import { Message, MessageBox } from '@/components/element-plus/el-feedback-util'
import { TextConstant } from '@/common/constants/TextConstant'

type RowType = ConnectionInfo<BaseConnectionDetail>

defineOptions({
  name: 'ManageConnectionDataTablePage'
})

const emit = defineEmits<{
  (e: 'selectRow', row: RowType): void
}>()

const connections = ref<RowType[]>([])
for (let i = 0; i < 1; i++) {
  connections.value.push({
    id: 1,
    name: '@localhost',
    dbType: 'mysql',
    status: 'no_connection',
    host: 'localhost',
    port: 3306,
    createBy: '',
    createTime: '',
    updateBy: '',
    updateTime: '',
    detail: {
      sessionNum: 0
    } as MySQLConnectionInfo
  })
  connections.value.push({
    id: 1,
    name: '127.0.0.1',
    dbType: 'sql_server_2012',
    status: 'connected',
    host: 'localhost',
    port: 3306,
    createBy: '',
    createTime: '',
    updateBy: '',
    updateTime: '',
    detail: {
      sessionNum: 0
    } as SQLServer2012ConnectionInfo
  })
}

const onClickRow = (row: RowType) => {
  emit('selectRow', row)
}

const tableRef = useComponentRef(ElTable)

/**
 * 删除表格行
 *
 * @param row   要删除的row
 */
const onDeleteRow = (row: RowType) => {
  MessageBox.deleteConfirm(TextConstant.deleteConfirm(row.name), (done) => {
    setTimeout(() => {
      // TODO 调后台接口删除连接
      Message.success('删除成功')
      done()
    }, 1000)
  })
}
</script>

<template>
  <div class="container">
    <el-table
      ref="tableRef"
      :data="connections"
      empty-text="暂无数据库连接"
      fit
      highlight-current-row
      max-height="530px"
      scrollbar-always-on
      style="width: 100%"
      @row-click="onClickRow"
    >
      <el-table-column prop="name" label="连接名"/>
      <el-table-column prop="status" label="状态" align="center" width="200"/>
      <el-table-column prop="host" label="主机 & 端口" align="center" width="300"/>
      <el-table-column prop="__action" label="操作" align="center" width="300">
        <template #default="{ row }">
          <el-button :icon="IconEdit" link text>修改</el-button>
          <el-button
            :icon="IconDelete"
            type="danger"
            link
            text
            @click="onDeleteRow(row)"
          >删除</el-button>
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
