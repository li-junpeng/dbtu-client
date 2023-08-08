<!--
 * 设置枚举值的popover组件
 *
 * @author HuaYu
 * @date 2023-08-02 11:54
-->
<script setup lang="ts">
import type { SetEnumValuesPopoverProp, TableItem, ComponentEmits } from './define'
import { SetEnumValuesPopoverPropDefault } from './define'
import type { TableColumnOption } from '@/components/ui/edit-table-popover'
import EditTablePopover from '@/components/ui/edit-table-popover/index.vue'

defineOptions({
  name: 'SetEnumValuesPopoverComponent'
})

const props = withDefaults(defineProps<SetEnumValuesPopoverProp>(), SetEnumValuesPopoverPropDefault)
const enums = reactive<TableItem[]>([])
const emits = defineEmits<ComponentEmits>()

// 添加项
const addItem = () => {
  return {
    id: Date.now(),
    enum: ''
  }
}

const columns = [
  {
    prop: 'enum',
    label: '值',
    component: 'input'
  }
] as TableColumnOption[]

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
  <EditTablePopover
    v-model="enums"
    row-key="id"
    :add-item="addItem"
    :columns="columns"
    :width="props.width"
    :height="props.height"
    placement="top"
  >
    <template #reference>
      <el-button type="info">设置</el-button>
    </template>
  </EditTablePopover>
</template>

<style scoped lang="scss"></style>
