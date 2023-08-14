<!--
 * 创建表外键
 *
 * @author HuaYu
 * @date 2023-08-11 20:39
-->
<script setup lang="ts">
import { ArrayUtils } from '@/common/utils/ArrayUtils'
import { MessageBox } from '@/components/element-plus/el-feedback-util'
import { useComponentRef } from '@/components/element-plus/element-plus-util'
import EditableTable, { type TableColumnOption } from '@/components/ui/editable-table'
import EditableTablePopover from '@/components/ui/editable-table-popover'
import { DATABASE_PROVIDE_KEY } from '..'
import { useConnectionSessionStore } from '@/stores/ConnectionSessionStore'
import type { MySQLConnectionSession } from '../../../connection-session'

defineOptions({
  name: 'MySqlCreateTableForeignKeysComponent'
})

const props = defineProps<{
  tableFields: MySqlTableField[]
}>()

// 注入顶级组件提供的数据库信息
const database = inject<MySqlDatabaseInstance>(DATABASE_PROVIDE_KEY)
const actionModes = ['CASCADE', 'NO ACTION', 'RESTRICT', 'SET NULL']

const connectionSessionStore = useConnectionSessionStore()

// 可编辑表格组件相关
const editableTableRef = useComponentRef(EditableTable)
const getSelectedRow = () => {
  return editableTableRef.value?.getCurrentRow<MySqlTableForeignKey>() || ref(null)
}

// 外键数据
const foreignKeys = defineModel<MySqlTableForeignKey[]>({
  required: true,
  default: []
})

// 当前连接会话下的所有数据库的库名列表
const databaseNames = computed<string[]>(() => {
  const session = connectionSessionStore.get(database?.sessionId!)
  if (!session) return []

  return (
    session.connection.children?.map(item => {
      return item.name
    }) || []
  )
})

// 被引用的数据库下的所有表的表名列表
const refTables = computed<MySqlTableInstance>(() => {

  /* console.log(1)
  if (!currentRefDatabase.value) return []
  
  const tableNode = currentRefDatabase.value.children?.[0] as TableNode
  if (!tableNode) return []

  console.log(tableNode.children)
  
  return tableNode.children?.map(item => item.name) || [] */
})

// 被引用的表中的所有字段列表
const refTableFields = computed(() => {
  /* const selectedRow = getSelectedRow()
  if (!selectedRow.value) return []

  
  return [] */
})

// 添加外键
const addForeignKey = () => {
  foreignKeys.value.push({
    id: Date.now(),
    name: '',
    fields: [],
    refFields: []
  })
  getSelectedRow().value = foreignKeys.value[foreignKeys.value.length - 1]
}

// 删除外键
const deleteForeignKey = () => {
  const selectedRow = getSelectedRow()
  if (selectedRow.value) {
    MessageBox.deleteConfirm('您确定要删除外键吗？', done => {
      const b = ArrayUtils.remove(foreignKeys.value, selectedRow.value?.id, 'id')
      if (b) {
        if (foreignKeys.value.length === 0) {
          addForeignKey()
        } else {
          selectedRow.value = foreignKeys.value[0]
        }
      }
      done()
    })
  }
}

const tableColumns = [
  {
    prop: 'name',
    label: '名',
    component: 'input',
    componentProp: {
      maxlength: 100
    }
  },
  {
    prop: 'fields',
    label: '字段',
    width: '250px',
    component: 'select',
    useSlot: true
  },
  {
    prop: 'refDatabase',
    label: '被引用的数据库',
    width: '200px',
    component: 'select',
    select: {
      options: databaseNames.value,
      clearable: true,
      filterable: true
    },
    componentProp: {
      onClear: () => {
        const selectedRow = getSelectedRow().value
        if (selectedRow) {
          selectedRow.refTable = ''
          selectedRow.refFields = []
        }
      }
    }
  },
  {
    prop: 'refTable',
    label: '被引用的表',
    width: '200px',
    component: 'select',
    // useSlot: true
    select: {
      options: []
    }
  },
  {
    prop: 'refFields',
    label: '被引用的字段',
    width: '200px',
    component: 'text',
    useSlot: true
  },
  {
    prop: 'deleteMode',
    label: '删除',
    width: '150px',
    component: 'select',
    select: {
      options: actionModes,
      clearable: true
    }
  },
  {
    prop: 'updateMode',
    label: '更新',
    width: '150px',
    component: 'select',
    select: {
      options: actionModes,
      clearable: true
    }
  }
] as TableColumnOption[]

const selectFieldColumns = [
  {
    prop: 'field',
    label: '字段',
    component: 'select',
    select: {
      options: props.tableFields.filter(item => item.field),
      valueKey: 'field',
      labelKey: 'field'
    }
  }
] as TableColumnOption[]

const getFieldText = (fields: { id: number; field: '' }[]) => {
  return fields
    .filter(item => item.field)
    .map(item => item.field)
    .join(',')
}

onMounted(() => {
  addForeignKey()
})

defineExpose({
  addForeignKey,
  deleteForeignKey
})
</script>

<template>
  <el-auto-resizer>
    <template #default="{ height }">
      <EditableTable
        ref="editableTableRef"
        v-model="foreignKeys"
        row-key="id"
        :height="height - 5"
        :columns="tableColumns"
      >
        <!-- 字段 -->
        <template #column-fields="{ row }">
          <div style="width: 100%; display: flex; align-items: center">
            <div
              class="dbtu-text-ellipsis row-readonly-text"
              style="flex: 1"
            >
              {{ getFieldText(row.fields) }}
            </div>
            <EditableTablePopover
              v-model="row.fields"
              :columns="selectFieldColumns"
              row-key="id"
              add-button-text="添加字段"
              delete-button-text="删除字段"
              :add-item="
                () => {
                  return {
                    id: Date.now(),
                    field: ''
                  }
                }
              "
            />
          </div>
        </template>
        <!-- 被引用的表 -->
        <template #column-refTable="{ row, isShowComponent }">
          <el-select
            v-if="isShowComponent()"
            v-model="row.refTable"
            clearable
            filterable
            placeholder=" "
            no-data-text="请先选择被引用的数据库"
          >
            <el-option
              v-for="item in refTables"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
          <span
            v-else
            class="row-readonly-text"
          >
            {{ row.refTable }}
          </span>
        </template>
        <!-- 被引用的字段 -->
        <template #column-refFields> 456 </template>
      </EditableTable>
    </template>
  </el-auto-resizer>
</template>

<style scoped lang="scss"></style>
