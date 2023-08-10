<!--
 * 测试页面
 *
 * @author HuaYu
 * @date 2023-08-09 21:28
-->
<script setup lang="ts">
import type { TableColumnOption } from '../src/editable-table'
import EditableTable from '@/components/ui/editable-table'

defineOptions({
  name: 'EditableTableTest'
})

const years = () => {
  const data = []
  for (let i = 1995; i <= 2005; i++) {
    data.push({
      key: i,
      label: `${i}年`
    })
  }
  return data
}

const month = () => {
  const months = []
  for (let i = 1; i <= 12; i++) {
    months.push({
      id: i,
      text: `${i}月`
    })
  }
  return months
}

const yearSelectRef = ref()

const rows = [
  {
    id: 1,
    name: '张三',
    age: 18,
    year: 1995,
    month: 2,
    gender: '男',
    mathPass: false,
    like: 2
  },
  {
    id: 2,
    name: '李四',
    age: 35,
    year: 2001,
    month: 8,
    gender: '男',
    mathPass: false,
    like: 2
  },
  {
    id: 3,
    name: '韩梅梅',
    age: 16,
    year: 1999,
    month: 4,
    gender: '女',
    mathPass: true,
    like: 3
  },
  {
    id: 4,
    name: '王五',
    age: 25,
    year: 2005,
    month: 9,
    gender: '男',
    mathPass: false,
    like: 1
  }
]

const columns = [
  {
    prop: 'id',
    label: 'ID',
    component: 'text'
  },
  {
    prop: 'name',
    label: '姓名',
    component: 'input',
    width: '200px'
  },
  {
    prop: 'age',
    label: '年龄',
    component: 'input-number',
    align: 'center',
    width: 100
  },
  {
    prop: 'year',
    label: '出生年',
    component: 'select',
    useSlot: true,
    slotRef: yearSelectRef
  },
  {
    prop: 'month',
    label: '出生月份',
    component: 'select',
    select: {
      options: month(),
      valueKey: 'id',
      labelKey: 'text',
      clearable: true,
      filterable: true
    }
  },
  {
    prop: 'gender',
    label: '性别',
    component: 'select',
    align: 'center',
    width: '100px',
    select: {
      options: ['男', '女']
    }
  },
  {
    prop: 'mathPass',
    label: '数学成绩是否合格',
    component: 'switch',
    align: 'center'
  },
  {
    prop: 'like',
    label: '丑',
    component: 'checkbox',
    align: 'center',
    checkbox: {
      trueValue: 1
    }
  },
  {
    prop: 'like',
    label: '还行',
    component: 'checkbox',
    align: 'center',
    checkbox: {
      trueValue: 2
    }
  },
  {
    prop: 'like',
    label: '漂亮',
    component: 'checkbox',
    align: 'center',
    checkbox: {
      trueValue: 3
    }
  }
] as TableColumnOption[]

const onClickRow = () => {
  console.log('on click row')
}
</script>

<template>
  <div class="container">
    <EditableTable
      v-model="rows"
      row-key="id"
      :columns="columns"
      @row-click="onClickRow"
    >
      <template #column-year="{ row, column, isShowComponent }">
        <el-select
          v-if="isShowComponent('select')"
          ref="yearSelectRef"
          v-model="row.year"
          clearable
          filterable
          placeholder=" "
        >
          <el-option
            v-for="item in years()"
            :key="item.key"
            :value="item.key"
            :label="item.label"
          />
        </el-select>
        <span
          v-else
          class="row-readonly-text"
        >
          {{ row.year }}年
        </span>
      </template>
    </EditableTable>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  background-color: pink;
  padding: 10px;
}
</style>
