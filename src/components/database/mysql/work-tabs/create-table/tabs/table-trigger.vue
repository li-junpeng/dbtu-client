<!--
 * 表触发器设置
 *
 * @author HuaYu
 * @date 2023-08-03 09:32
-->
<script setup lang="ts">
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { useComponentRef } from '@/components/element-plus/element-plus-util'
import Contextmenu from '@/components/ui/contextmenu'
import { ArrayUtils } from '@/common/utils/ArrayUtils'
import { MessageBox } from '@/components/element-plus/el-feedback-util'
import MonacoEditor from '@/components/ui/monaco-editor/index.vue'
import EditableTable, { type TableColumnOption } from '@/components/ui/editable-table'
import type { PropType } from 'vue'

type TableColumn = TableColumnCtx<unknown>

defineOptions({
  name: 'MySQLTableTriggerSettingComponent'
})

const props = defineProps({
  tableInfo: {
    type: Object as PropType<MySqlTableInstance>,
    required: true
  }
})

const tableData = defineModel<TableTrigger[]>({
  required: true
})
const rowSql = ref('')

const editableTableRef = useComponentRef(EditableTable)
const setSelectedRow = (row: TableTrigger) => {
  editableTableRef.value?.setCurrentRow(row)
}
const getSelectedRow = () => {
  return editableTableRef.value?.getCurrentRow<TableTrigger>() || ref(null)
}

watch(
  () => rowSql.value,
  () => {
    const selectedRow = getSelectedRow()
    selectedRow.value && (selectedRow.value.body = rowSql.value)
  }
)

watch(
  () => getSelectedRow().value,
  () => {
    rowSql.value = getSelectedRow().value?.body || ''
  }
)

/**
 * 添加触发器
 *
 * @param index  指定在列表中的位置, 默认在末尾添加
 */
const addRow = (index?: number) => {
  const defaultData: Partial<TableTrigger> = {
    id: Date.now(),
    name: '',
    table: props.tableInfo.name,
    body: ''
  }
  if (index === 0) {
    index = void 0
  }
  if (index !== undefined) {
    tableData.value.splice(index, 0, defaultData as TableTrigger)
    setSelectedRow(tableData.value[index])
  } else {
    tableData.value.push(defaultData as TableTrigger)
    setSelectedRow(tableData.value[tableData.value.length - 1])
  }
}

/**
 * 插入触发器
 */
const appendRow = () => {
  addRow(ArrayUtils.indexOf(tableData.value, getSelectedRow().value?.id, 'id'))
}

/**
 * 复制触发器
 */
const copyRow = () => {
  const selectedRow = getSelectedRow()
  if (!selectedRow.value) {
    return
  }

  tableData.value.push({
    ...selectedRow.value,
    id: Date.now()
  })
  setSelectedRow(tableData.value[tableData.value.length - 1])
}

/**
 * 删除触发器
 */
const deleteRow = () => {
  const selectedRow = getSelectedRow()
  if (!selectedRow.value) {
    return
  }

  MessageBox.deleteConfirm('您确认要删除触发器吗？', done => {
    const b = ArrayUtils.remove(tableData.value, selectedRow.value!.id, 'id')
    if (b) {
      if (tableData.value.length === 0) {
        addRow()
      } else {
        setSelectedRow(tableData.value[0])
      }
    }
    done()
  })
}

/**
 * 上移
 */
const moveUpRow = () => {
  const selectedRow = getSelectedRow()
  if (!selectedRow.value) {
    return
  }

  ArrayUtils.moveUp(tableData.value, selectedRow.value, 'id')
}

/**
 * 下移
 */
const moveDownRow = () => {
  const selectedRow = getSelectedRow()
  if (!selectedRow.value) {
    return
  }

  ArrayUtils.moveDown(tableData.value, selectedRow.value, 'id')
}

// el-table-column @row-contextmenu
const rowContextmenu = (row: TableTrigger, column: TableColumn, event: MouseEvent) => {
  event.preventDefault()
  getSelectedRow().value = row
  editableTableRef.value?.setCurrentColumn(null)
  Contextmenu({
    event,
    menus: [
      {
        label: '添加触发器',
        onClick: () => {
          addRow()
        }
      },
      {
        label: '插入触发器',
        onClick: () => {
          appendRow()
        }
      },
      {
        label: '复制触发器',
        onClick: () => {
          copyRow()
        }
      },
      {
        label: '删除触发器',
        divided: true,
        onClick: () => {
          deleteRow()
        }
      },
      {
        label: '上移',
        onClick: () => {
          moveUpRow()
        }
      },
      {
        label: '下移',
        onClick: () => {
          moveDownRow()
        }
      }
    ]
  })
}

const tableColumns = [
  {
    prop: 'name',
    label: '名',
    width: '300px',
    component: 'input',
    componentProp: {
      maxlength: 100
    }
  },
  {
    prop: 'type',
    label: '触发',
    width: '150px',
    component: 'select',
    select: {
      options: ['AFTER', 'BEFORE'],
      clearable: true
    }
  },
  {
    prop: 'insert',
    label: '插入',
    width: '100px',
    align: 'center',
    component: 'checkbox',
    componentProp: {
      onChange: (value: boolean) => {
        if (value) {
          getSelectedRow().value!.update = false
          getSelectedRow().value!.delete = false
        }
      }
    }
  },
  {
    prop: 'update',
    label: '更新',
    width: '100px',
    align: 'center',
    component: 'checkbox',
    componentProp: {
      onChange: (value: boolean) => {
        if (value) {
          getSelectedRow().value!.insert = false
          getSelectedRow().value!.delete = false
        }
      }
    }
  },
  {
    prop: 'delete',
    label: '删除',
    width: '100px',
    align: 'center',
    component: 'checkbox',
    componentProp: {
      onChange: (value: boolean) => {
        if (value) {
          getSelectedRow().value!.insert = false
          getSelectedRow().value!.update = false
        }
      }
    }
  }
] as TableColumnOption[]

onMounted(() => {
  addRow()
})

defineExpose({
  addRow,
  appendRow,
  deleteRow,
  moveUpRow,
  moveDownRow
})
</script>

<template>
  <div class="top-form">
    <EditableTable
      ref="editableTableRef"
      v-model="tableData"
      row-key="id"
      height="390px"
      :columns="tableColumns"
      @row-contextmenu="rowContextmenu"
    />
  </div>
  <div class="bottom-sql">
    <p style="height: 34px; line-height: 34px">定义</p>
    <div style="width: 100%; height: calc(100% - 34px)">
      <MonacoEditor
        v-if="getSelectedRow().value"
        v-model="rowSql"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.top-form {
  width: 100%;
  height: 400px;
}

.bottom-sql {
  width: 100%;
  height: calc(100% - 400px);
  border-top: 1px solid var(--dbtu-divide-borer-color);
  padding: 10px 0;
}
</style>
