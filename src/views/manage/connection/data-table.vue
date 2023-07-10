<!--
 * 连接数据表格
 *
 * @author Junpeng.Li
 * @date 2023-06-30 22:
-->
<script setup lang="ts">
import { computed } from 'vue'
import { ElButton, ElTable, ElTableColumn } from 'element-plus'
import { Delete as IconDelete, Edit as IconEdit } from '@element-plus/icons-vue'
import { useComponentRef } from '@/components/element-plus/elemenet-plus-util'
import { Message, MessageBox } from '@/components/element-plus/el-feedback-util'
import { TextConstant } from '@/common/constants/TextConstant'
import { useConnectionStore } from '@/stores/ConnectionStore'

type RowType = ConnectionInfo<BaseConnectionDetail>

defineOptions({
  name: 'ManageConnectionDataTablePage'
})

const emit = defineEmits<{
  (e: 'selectRow', row: RowType | null): void
}>()

const connectionStore = useConnectionStore()
const connections = computed(() => {
  return connectionStore.connections
})

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
  MessageBox.deleteConfirm(TextConstant.deleteConfirm(row.name), async (done) => {
    const {status, message} = await connectionStore.removeById(row.id as number)
    if (status === 'success') {
      Message.success(message)
    } else {
      await MessageBox.error(message)
    }

    emit('selectRow', null)

    done()
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
          >
            <span>删除</span>
          </el-button>
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
