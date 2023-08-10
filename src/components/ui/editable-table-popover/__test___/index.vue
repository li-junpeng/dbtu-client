<!--
 * 测试页面
 *
 * @author HuaYu
 * @date 2023-08-08 10:41
-->
<script setup lang="ts">
import type { TableColumnOption } from '@/components/ui/editable-table'
import EditableTablePopover from '@/components/ui/editable-table-popover'

defineOptions({
  name: 'TestPage'
})

const weekSelectRef = ref()

const fields = ref([
  {
    id: 10,
    field: 'id',
    append: 1,
    open: false,
    month: 1,
    week: 2
  },
  {
    id: 20,
    field: 'name',
    append: 2,
    open: true
  },
  {
    id: 30,
    field: 'username',
    append: 2,
    open: false
  },
  {
    id: 40,
    field: 'password',
    append: 2,
    open: false
  }
])

const columns = [
  {
    label: 'id',
    prop: 'id',
    component: 'input-number'
  },
  {
    label: 'field',
    prop: 'field',
    component: 'input'
  },
  {
    label: '插入',
    prop: 'append',
    component: 'checkbox',
    align: 'center',
    checkbox: {
      trueValue: 1
    }
  },
  {
    label: '更新',
    prop: 'append',
    component: 'checkbox',
    align: 'center',
    checkbox: {
      trueValue: 2
    }
  },
  {
    label: '开启',
    prop: 'open',
    component: 'switch',
    align: 'center'
  },
  {
    label: '月份',
    prop: 'month',
    component: 'select',
    select: {
      options: [
        {
          key: 1,
          label: '1月'
        },
        {
          key: 2,
          label: '2月'
        },
        {
          key: 3,
          label: '3月'
        }
      ],
      valueKey: 'key',
      labelKey: 'label',
      clearable: true,
      filterable: true
    }
  },
  {
    label: '星期',
    prop: 'week',
    component: 'select',
    useSlot: true,
    slotRef: weekSelectRef
  }
] as TableColumnOption[]

const addItem = () => {
  return {
    id: Date.now(),
    field: 'test'
  }
}
</script>

<template>
  <div
    style="
      width: 500px;
      height: 500px;
      background-color: pink;
      display: flex;
      align-items: center;
      justify-content: center;
    "
  >
    <EditableTablePopover
      v-model="fields"
      row-key="id"
      :add-item="addItem"
      :columns="columns"
      :width="800"
    >
      <template #reference>
        <el-button>选择</el-button>
      </template>
      <template #column-week="{ column, row, isShowComponent }">
        <el-select
          v-if="isShowComponent(column, 'select', row)"
          ref="weekSelectRef"
          v-model="row.week"
        >
          <el-option
            v-for="item in [1, 2, 3, 4, 5, 6, 7]"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
        <span
          v-else
          class="row-readonly-text"
          >{{ row.week }}+</span
        >
      </template>
    </EditableTablePopover>
  </div>
</template>

<style scoped lang="scss"></style>
