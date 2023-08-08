<!--
 * 使用el-popover显示可编辑表格, 通过设置MySQL枚举值、设置表索引字段等场景抽离出来的组件
 * 具体使用场景可以查看MySQL创建表中的表索引
 *
 * @author HuaYu
 * @date 2023-08-07 23:21
-->
<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { ElInput } from 'element-plus'
import type {
  EditTablePopoverProps,
  EditTablePopoverSlots,
  TableColumnOption,
  TableColumnComponentType,
  TableColumn,
  TableRowItem
} from '.'
import { reactive, ref } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { EditTablePopoverPropDefaults } from '.'
import { ArrayUtils } from '@/common/utils/ArrayUtils'
import { useComponentRef } from '@/components/element-plus/element-plus-util'

defineOptions({
  name: 'EditTablePopoverComponent'
})

defineSlots<EditTablePopoverSlots>()

// @ts-ignore
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
const moveTop = () => {
  ArrayUtils.moveTop(tableRows.value, selectedRow.value, props.rowKey)
}

// 下移
const moveBottom = () => {
  ArrayUtils.moveBottom(tableRows.value, selectedRow.value, props.rowKey)
}

// 单元格内表单组件的实例
const inputRef = useComponentRef(ElInput)
const inputNumberRef = useComponentRef(ElInputNumber)

// 是否显示单元格内的表单组件
const isShowComponent = (
  column: TableColumnOption,
  component: TableColumnComponentType,
  row: TableRowItem
) => {
  return (
    selectedRow.value?.[props.rowKey] === row[props.rowKey] &&
    column.component === component &&
    selectedColumn.value?.property === column.prop
  )
}

// 点击单元格时, 使其变为可编辑状态
watch(
  () => [selectedRow.value, selectedColumn.value],
  () => {
    nextTick(() => {
      const prop = selectedColumn.value?.property
      const column = props.columns.find(item => item.prop === prop)
      if (column) {
        switch (column.component) {
          case 'input':
            // @ts-ignore
            inputRef.value?.[0].focus()
            break
          case 'input-number':
            // @ts-ignore
            inputNumberRef.value?.[0].focus()
            break
        }
      }
    })
  }
)

// #region 在滚动或者切换tab选项卡时, 使popover隐藏
const mainRef = ref()
const mainVisible = useElementVisibility(mainRef)
watch([mainVisible], () => {
  if (!mainVisible.value) {
    popover.visible = false
  }
})
// #endregion

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
        class="popover-container"
        :style="containerStyle"
      >
        <el-table
          :data="tableRows"
          border
          :height="tableHeight"
          highlight-current-row
          :current-row-key="selectedRow?.[props.rowKey]"
          :row-key="props.rowKey"
          scrollbar-always-on
          @row-click="onClickRow"
          class="el-table-editable"
        >
          <!-- 序号列 -->
          <el-table-column
            type="index"
            width="50px"
            label="#"
            align="center"
            class-name="bg-is-theme-color"
            style="cursor: pointer"
          >
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>

          <el-table-column
            v-for="column in props.columns"
            :key="column.prop"
            :label="column.label"
            :prop="column.prop"
            :align="column.align || 'left'"
          >
            <template #default="{ row }">
              <el-input
                v-if="isShowComponent(column, 'input', row)"
                ref="inputRef"
                v-model="row[column.prop]"
              />

              <el-input-number
                v-else-if="isShowComponent(column, 'input-number', row)"
                ref="inputNumberRef"
                v-model="row[column.prop]"
                :controls="false"
                class="el-input-number__text-left"
                style="width: 100%"
              />

              <el-checkbox
                v-else-if="column.component === 'checkbox'"
                v-model="row[column.prop]"
                :true-label="column.checkbox?.trueValue"
                :false-label="column.checkbox?.falseValue || ''"
              />

              <el-switch
                v-else-if="column.component === 'switch'"
                size="small"
                v-model="row[column.prop]"
                :active-value="column.switch?.trueValue || true"
                :inactive-value="column.switch?.falseValue || false"
              />

              <el-select
                v-else-if="isShowComponent(column, 'select', row)"
                v-model="row[column.prop]"
                :clearable="column.select?.clearable || false"
                :filterable="column.select?.filterable || false"
                :placeholder="column.select?.placeholder || ' '"
                style="width: 100%"
              >
                <el-option
                  v-for="item in column.select?.options"
                  :key="column.select!.valueKey ? item[column.select!.valueKey] : item"
                  :value="column.select!.valueKey ? item[column.select!.valueKey] : item"
                  :label="column.select!.labelKey ? item[column.select!.labelKey] : item"
                />
              </el-select>

              <!-- 动态插槽, 插槽名: column-${column.prop} -->
              <slot
                v-else-if="column.component === 'slot'"
                :name="`column-${column.prop}`"
                :column="column"
                :row="row"
                :currentRow="selectedRow"
                :currentColumn="selectedColumn"
              >
                <div style="color: #f00">请自定义插槽: #column-{{ column.prop }}</div>
              </slot>

              <!-- 文本显示 -->
              <span
                v-else
                class="row-readonly-text"
              >
                {{ row[column.prop] }}+
              </span>
            </template>
          </el-table-column>

          <!-- <slot name="columns" :current-row="selectedRow">
          </slot> -->
        </el-table>

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
              添加项
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
              删除项
            </el-button>

            <el-button
              text
              link
              :disabled="!selectedRow"
              @click="moveTop"
            >
              <template #icon>
                <IconTop />
              </template>
              上移
            </el-button>

            <el-button
              text
              link
              :disabled="!selectedRow"
              @click="moveBottom"
            >
              <template #icon>
                <IconBottom />
              </template>
              下移
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
