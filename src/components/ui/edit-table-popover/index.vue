<!--
 * 使用el-popover显示可编辑表格, 通过设置MySQL枚举值、设置表索引字段等场景抽离出来的组件
 * 具体使用场景可以查看MySQL创建表中的表索引
 *
 * @author HuaYu
 * @date 2023-08-07 23:21
-->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { TableColumnCtx } from 'element-plus'
import type { EditTablePopoverProps, EditTablePopoverSlots } from '.'
import { EditTablePopoverPropDefaults } from '.'

type TableColumn = TableColumnCtx<unknown>
type TableRowItem = any

defineOptions({
  name: 'EditTablePopoverComponent'
})

defineSlots<EditTablePopoverSlots>()

const props = withDefaults(defineProps<EditTablePopoverProps>(), EditTablePopoverPropDefaults)

const popover = reactive({
  visible: false
})

const tableRows = defineModel<TableRowItem[]>({
  required: true
})
const selectedRow = ref<TableRowItem | null>(null)
const selectedColumn = ref<TableColumn | null>(null)

// 点击了表格行
const onClickRow = (row: TableRowItem, column: TableColumn) => {
  selectedRow.value = row
  selectedColumn.value = column
}

const open = () => {
  popover.visible = true
}
</script>

<template>
  <div>
    <el-popover
      trigger="click"
      :placement="props.placement"
      :width="props.width"
      :persistent="false"
      :hide-after="0"
      :visible="popover.visible"
      transition=" "
    >
      <template #reference>
        <!-- 用来触发显示popover的插槽 -->
        <slot
          name="reference"
          :open="open"
        >
          <el-button
            ref="buttonRef"
            text
            link
            @click="open"
            style="padding: 0 10px"
          >
            <template #icon>
              <IconMoreFilled />
            </template>
          </el-button>
        </slot>
      </template>

      <div class="popover-container">
        <el-table
          :data="tableRows"
          border
          height="256px"
          highlight-current-row
          :current-row-key="selectedRow?.id"
          row-key="id"
          scrollbar-always-on
          @row-click="onClickRow"
          class="el-table-editable"
        >
        </el-table>
      </div>
    </el-popover>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/css-style/el-table-editable';

.popover-container {
  width: 100%;
  height: 300px;
}

.footer {
  margin-top: 10px;
  width: 100%;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
