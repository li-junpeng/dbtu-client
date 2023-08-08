<!--
 * 创建索引, 选择表字段组件
 *
 * @author HuaYu
 * @date 2023-08-07 21:53
-->
<script setup lang="ts">
import type { TableColumnOption } from '@/components/ui/edit-table-popover'
import EditTablePopover from '@/components/ui/edit-table-popover/index.vue'

defineOptions({
  name: 'MySqlTableIndexSettingForSelectFieldsComponent'
})

const props = defineProps({
  fields: {
    type: Array as () => MySqlTableField[],
    required: true
  }
})

const fields = defineModel<MySqlTableIndexField[]>({
  required: true
})

const addField = () => {
  return {
    id: Date.now(),
    field: ''
  }
}

const columns = [
  {
    prop: 'field',
    label: '字段',
    component: 'select',
    select: {
      options: props.fields,
      labelKey: 'field',
      valueKey: 'field'
    }
  },
  {
    prop: 'subPart',
    label: '子部分',
    component: 'input-number',
    width: '150px'
  }
] as TableColumnOption[]

</script>

<template>
  <div>
    <EditTablePopover
      v-model="fields"
      row-key="id"
      :add-item="addField"
      :columns="columns"
    />
  </div>
</template>

<style scoped lang="scss"></style>
