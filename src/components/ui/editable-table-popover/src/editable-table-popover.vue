<!--
 * 使用el-popover显示可编辑表格, 通过设置MySQL枚举值、设置表索引字段等场景抽离出来的组件
 * 具体使用场景可以查看MySQL创建表中的表索引
 *
 * @author HuaYu
 * @date 2023-08-07 23:21
-->
<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { EditableTablePopoverProps, EditableTablePopoverSlots } from './editable-table-popover'
import type { TableRowItem } from '@/components/ui/editable-table'
import { reactive, ref } from 'vue'
import { useElementVisibility, onClickOutside } from '@vueuse/core'
import { EditableTablePopoverPropDefaults } from './editable-table-popover'
import { ArrayUtils } from '@/common/utils/ArrayUtils'
import EditableTable from '@/components/ui/editable-table/src/editable-table.vue'

defineOptions({
  name: 'EditableTablePopoverComponent'
})

defineSlots<EditableTablePopoverSlots>()

// @ts-ignore
const props = withDefaults(defineProps<EditableTablePopoverProps>(), EditableTablePopoverPropDefaults)

const popover = reactive({
  visible: false
})
const containerRef = ref<HTMLDivElement>()

const tableRows = defineModel<TableRowItem[]>({
  required: true,
  default: []
})
const selectedRow = ref<TableRowItem | null>(null)
const onClickRow = (row: TableRowItem) => {
  selectedRow.value = row
}

// el-table height
const tableHeight = computed<string>(() => {
  // 总高度 - 底部高度(34px) - 底部的margin-top(10px)
  return `${props.height - 44}px`
})

// popover容器样式
const containerStyle = computed(() => {
  return {
    width: '100%',
    height: `${props.height}px`
  } as CSSProperties
})

// 优化: 点击popover以外的区域自动关闭popover
onClickOutside(containerRef, event => {
  let target = event.target as HTMLElement

  // 是否点击了el-select下拉选项
  const isElSelect = () => {
    if (target.localName === 'span') {
      target = target.parentElement!
    }
    const className = target?.className || ''
    return className.includes('el-select')
  }

  if (isElSelect()) return

  popover.visible = false
})

// 添加项
const addItem = () => {
  const item = props.addItem?.()
  if (item === null || item === void 0) {
    return
  }

  tableRows.value.push(item)
  selectedRow.value = tableRows.value[tableRows.value.length - 1]
}

// 删除项
const deleteItem = () => {
  const b = ArrayUtils.remove(tableRows.value, selectedRow.value?.[props.rowKey], props.rowKey)
  if (b) {
    if (tableRows.value.length === 0) {
      addItem()
    } else {
      selectedRow.value = tableRows.value[0]
    }
  }
}

// 上移
const moveUp = () => {
  ArrayUtils.moveUp(tableRows.value, selectedRow.value, props.rowKey)
}

// 下移
const moveDown = () => {
  ArrayUtils.moveDown(tableRows.value, selectedRow.value, props.rowKey)
}

// #region 在滚动或者切换tab选项卡时, 使popover隐藏
const mainRef = ref()
const mainVisible = useElementVisibility(mainRef)
watch([mainVisible], () => {
  if (!mainVisible.value) {
    popover.visible = false
  }
})
// #endregion

const slots = computed(() => {
  const data = [] as string[]
  props.columns.forEach(item => {
    if (item.useSlot) {
      data.push(item.prop)
    }
  })
  return data
})

onMounted(() => {
  addItem()
})
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
        <div
          ref="mainRef"
          @click="popover.visible = true"
        >
          <slot name="reference">
            <el-button
              ref="buttonRef"
              text
              link
              style="padding: 0 10px"
            >
              <template #icon>
                <IconMoreFilled />
              </template>
            </el-button>
          </slot>
        </div>
      </template>

      <div
        ref="containerRef"
        class="popover-container"
        :style="containerStyle"
      >
        <EditableTable
          v-model="tableRows"
          :row-key="props.rowKey"
          :height="tableHeight"
          :columns="props.columns"
          :current-row-key="selectedRow?.[props.rowKey]"
          @row-click="onClickRow"
        >
          <template
            v-for="item in slots"
            #[`column-${item}`]="{ row, column, currentRow, currentColumn, isShowComponent }"
          >
            <slot
              :name="`column-${column.prop}`"
              :column="column"
              :row="row"
              :currentRow="currentRow"
              :currentColumn="currentColumn"
              :isShowComponent="isShowComponent"
            ></slot>
          </template>
        </EditableTable>

        <div class="footer">
          <div>
            <el-button
              text
              link
              @click="addItem"
            >
              <template #icon>
                <IconPlus />
              </template>
              {{ props.addButtonText }}
            </el-button>

            <el-button
              text
              link
              :disabled="!selectedRow"
              @click="deleteItem"
            >
              <template #icon>
                <IconDelete />
              </template>
              {{ props.deleteButtonText }}
            </el-button>

            <el-button
              text
              link
              :disabled="!selectedRow"
              @click="moveUp"
            >
              <template #icon>
                <IconTop />
              </template>
              {{ props.moveUpButtonText }}
            </el-button>

            <el-button
              text
              link
              :disabled="!selectedRow"
              @click="moveDown"
            >
              <template #icon>
                <IconBottom />
              </template>
              {{ props.moveDownButtonText }}
            </el-button>
          </div>

          <div>
            <el-button
              type="info"
              @click="popover.visible = false"
            >
              <span>关闭</span>
            </el-button>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<style scoped lang="scss">
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
