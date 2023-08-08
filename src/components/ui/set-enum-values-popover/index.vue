<!--
 * 设置枚举值的popover组件
 *
 * @author HuaYu
 * @date 2023-08-02 11:54
-->
<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { SetEnumValuesPopoverProp, TableItem, ComponentEmits } from './define'
import { SetEnumValuesPopoverPropDefault } from './define'
import { ArrayUtils } from '@/common/utils/ArrayUtils'

defineOptions({
  name: 'SetEnumValuesPopoverComponent'
})

const props = withDefaults(defineProps<SetEnumValuesPopoverProp>(), SetEnumValuesPopoverPropDefault)
const enums = reactive<TableItem[]>([
  {
    id: Date.now(),
    enum: ''
  }
])
const emits = defineEmits<ComponentEmits>()
const contentStyle = computed<CSSProperties>(() => {
  return {
    width: '100%',
    height: `${props.height! + 34}px`
  }
})

// 当前选择的项
const selectedRow = ref<TableItem>(enums[0])

/**
 * 点击表格行
 *
 * @param row 行数据
 */
const onClickRow = (row: TableItem) => {
  selectedRow.value = row
}

// 添加项
const addItem = () => {
  enums.push({
    id: Date.now(),
    enum: ''
  })
}

// 删除项
const deleteItem = () => {
  if (!selectedRow.value) {
    return
  }

  const b = ArrayUtils.remove(enums, selectedRow.value.id, 'id')
  if (b && enums.length === 0) {
    addItem()
  }
  selectedRow.value = enums[0]
}

// 上移项
const moveUpItem = () => {
  ArrayUtils.moveUp(enums, selectedRow.value, 'id')
}

// 下移项
const moveDownItem = () => {
  ArrayUtils.moveDown(enums, selectedRow.value, 'id')
}

watch(
  () => enums,
  () => {
    emits('change-enums', {
      enums,
      text: enums
        .filter(item => item.enum)
        .map(item => `'${item.enum}'`)
        .join(',')
    })
  },
  { deep: true }
)
</script>

<template>
  <el-popover
    trigger="click"
    placement="top"
    :width="props.width"
    :persistent="false"
    :hide-after="0"
  >
    <template #reference>
      <slot>
        <el-button type="info">设置</el-button>
      </slot>
    </template>
    <div :style="contentStyle">
      <div
        :style="{
          width: '100%',
          height: `${props.height}px`
        }"
      >
        <el-table
          :data="enums"
          border
          :current-row-key="selectedRow?.id"
          row-key="id"
          :height="props.height! - 20"
          highlight-current-row
          @row-click="onClickRow"
          class="el-table-editable"
        >
          <el-table-column
            type="index"
            :index="index => index + 1"
            width="50px"
            label="#"
            align="center"
            class-name="bg-is-theme-color"
          />
          <el-table-column label="值">
            <template #default="{ row }">
              <el-input
                v-model="row.enum"
                :maxlength="50"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="width: 100%; height: 34px; display: flex; align-items: center">
        <el-button
          text
          link
          @click="addItem"
        >
          <template #icon>
            <IconPlus />
          </template>
          <span>添加项</span>
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
          <span>删除项</span>
        </el-button>
        <el-button
          text
          link
          @click="moveUpItem"
        >
          <template #icon>
            <IconTop />
          </template>
          <span>上移</span>
        </el-button>
        <el-button
          text
          link
          @click="moveDownItem"
        >
          <template #icon>
            <icon-bottom />
          </template>
          <span>下移</span>
        </el-button>
      </div>
    </div>
  </el-popover>
</template>

<style scoped lang="scss">
@use '@/assets/css-style/el-table-editable';
</style>
