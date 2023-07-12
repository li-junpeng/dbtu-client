<!--
 * 连接数据表格
 *
 * @author Junpeng.Li
 * @date 2023-06-30 22:
-->
<script setup lang="ts">
import { computed } from 'vue'
import { ElButton, ElTable, ElTableColumn } from 'element-plus'
import { Delete as IconDelete, Edit as IconEdit, Sugar as IconSugar } from '@element-plus/icons-vue'
import { useComponentRef } from '@/components/element-plus/elemenet-plus-util'
import { Message, MessageBox } from '@/components/element-plus/el-feedback-util'
import { TextConstant } from '@/common/constants/TextConstant'
import { useConnectionStore } from '@/stores/ConnectionStore'
import StatusItem from './status-item.vue'
import { StringUtils } from '@/common/utils/StringUtils'

type RowType = ConnectionInfo<BaseConnectionDetail>

defineOptions({
  name: 'ManageConnectionDataTablePage'
})

const emits = defineEmits<{
  /**
   * 选择行的回调
   *
   * @param e     function name
   * @param row   行内容
   */
  (e: 'selectRow', row: RowType | null): void,

  /**
   * 点击了编辑按钮
   *
   * @param e     function name
   * @param row   行内容
   */
  (e: 'click-edit', row: RowType): void
}>()

const connectionStore = useConnectionStore()
const connections = computed(() => {
  return connectionStore.connections
})

const onClickRow = (row: RowType) => {
  emits('selectRow', row)
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

    emits('selectRow', null)

    done()
  })
}

/**
 * 点击了编辑按钮
 *
 * @param row   行信息
 */
const onClickEdit = (row: RowType) => {
  emits('click-edit', row)
}

/**
 * 修改连接状态
 *
 * @param row  连接信息
 */
const onChangeConnectionStatus = (row: RowType) => {
  switch (row.status) {
    case 'connecting':
      // nothing
      break
    case 'no_connection':
      row.status = 'connecting'

      setTimeout(() => {
        row.status = 'connected'
      }, 1000)
      break
    case 'connected':
      row.status = 'no_connection'
      break
    default:
      MessageBox.error(`未处理的连接状态: ${row.status}`)
  }
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
      <el-table-column prop="status" label="状态" align="center" width="200">
        <template #default="{ row }">
          <status-item :status="row.status"/>
        </template>
      </el-table-column>
      <el-table-column prop="host" label="主机 & 端口" align="center" width="300">
        <template #default="{ row }">
          {{ row.host ? row.host + ':' + row.port : StringUtils.NULL_SHOW_VALUE }}
        </template>
      </el-table-column>
      <el-table-column prop="__action" label="操作" align="center" width="300">
        <template #default="{ row }">
          <el-button
            :icon="IconSugar"
            link
            text
            :disabled="row.status === 'connecting'"
            :loading="row.status === 'connecting'"
            @click="onChangeConnectionStatus(row)"
          >
            <span>{{
                row.status === 'connected'
                  ? '关闭连接'
                  : row.status === 'no_connection'
                    ? '打开连接'
                    : '正在连接'
              }}</span>
          </el-button>
          <el-button
            :icon="IconEdit"
            link
            text
            @click="onClickEdit(row)"
          >
            <span>修改</span>
          </el-button>
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
