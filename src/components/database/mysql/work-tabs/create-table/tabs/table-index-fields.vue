<!--
 * 创建索引, 选择表字段组件
 *
 * @author HuaYu
 * @date 2023-08-07 21:53
-->
<script setup lang="ts">
import type { TableColumnOption } from '@/components/ui/editable-table'
import EditableTablePopover from '@/components/ui/editable-table-popover'

defineOptions({
  name: 'MySqlTableIndexSettingForSelectFieldsComponent'
})

const props = defineProps({
  fields: {
    type: Array as () => TableColumn[],
    required: true
  }
})

const fields = defineModel<{ name: string; precision?: number }[]>({
  required: true
})

const addField = () => {
  return {
    id: Date.now(),
    name: '',
    precision: null
  }
}

const columns = [
  {
    prop: 'name',
    label: '字段',
    component: 'select',
    select: {
      options: props.fields,
      labelKey: 'name',
      valueKey: 'name'
    }
  },
  {
    prop: 'precision',
    label: '子部分',
    component: 'input-number',
    width: '150px'
  }
] as TableColumnOption[]

</script>

<template>
  <div>
    <EditableTablePopover
      v-model="fields"
      row-key="id"
      :add-item="addField"
      :columns="columns"
      add-button-text="添加字段"
      delete-button-text="删除字段"
    />
  </div>
</template>

<style scoped lang="scss"></style>
