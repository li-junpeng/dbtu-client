<!--
 * 表索引设置
 *
 * @author HuaYu
 * @date 2023-08-03 14:26
-->
<script setup lang="ts">
import { type TableIndexProp, TableIndexPropDefault } from './table-index'
import { ArrayUtils } from '@/common/utils/ArrayUtils'
import { ElInput, type TableColumnCtx } from 'element-plus'
import { useComponentRef } from '@/components/element-plus/element-plus-util'
import { IndexTypes } from '@/common/constants/MySqlConstant'
import Contextmenu from '@/components/ui/contextmenu'
import { MessageBox } from '@/components/element-plus/el-feedback-util'
import SelectFields from './table-index-fields.vue'
import EditableTable, { type TableColumnOption } from '@/components/ui/editable-table'

type TableColumn = TableColumnCtx<any>

defineOptions({
  name: 'MySQLTableIndexSettingComponent'
})

const props = withDefaults(defineProps<TableIndexProp>(), TableIndexPropDefault)

const tableData = defineModel<MySqlTableIndex[]>({
  required: true
})
const editableTableRef = useComponentRef(EditableTable)
const setCurrentRow = (row: MySqlTableIndex) => {
  editableTableRef.value?.setCurrentRow(row)
}
const getCurrentRow = () => {
  return editableTableRef.value?.getCurrentRow<MySqlTableIndex>() || ref(null)
}

// 添加索引
const addRow = () => {
  tableData.value.push({
    id: Date.now(),
    name: '',
    fields: []
  })
  setCurrentRow(tableData.value[tableData.value.length - 1])
}

// 删除索引
const deleteRow = () => {
  const selectedRow = getCurrentRow()
  if (!selectedRow.value) {
    return
  }

  MessageBox.deleteConfirm('您确定要删除索引吗？', done => {
    const b = ArrayUtils.remove(tableData.value, selectedRow.value!.id, 'id')
    if (b) {
      if (tableData.value.length === 0) {
        addRow()
      } else {
        selectedRow.value = tableData.value[0]
      }
    }
    done()
  })
}

// el-table @row-contextmenu
const rowContextmenu = (row: MySqlTableIndex, column: TableColumn, event: MouseEvent) => {
  event.preventDefault()
  setCurrentRow(row)
  editableTableRef.value?.setCurrentColumn(null)
  Contextmenu({
    event,
    menus: [
      {
        label: '添加索引',
        onClick: () => {
          addRow()
        }
      },
      {
        label: '删除索引',
        onClick: () => {
          deleteRow()
        }
      }
    ]
  })
}

// 生成用来描述的表字段文本
const getFieldText = (fields: MySqlTableIndexField[]) => {
  if (ArrayUtils.isEmpty(fields)) {
    return ''
  }
  return fields
    .filter(item => item.field)
    .map(item => `\`${item.field}\``)
    .join(',')
}

const tableColumns = [
  {
    prop: 'name',
    label: '名',
    width: '300px',
    component: 'input'
  },
  {
    prop: 'fields',
    label: '字段',
    width: '300px',
    component: 'text',
    useSlot: true
  },
  {
    prop: 'indexType',
    label: '索引类型',
    width: '150px',
    component: 'select',
    select: {
      options: IndexTypes,
      clearable: true
    }
  },
  {
    prop: 'indexMethod',
    label: '索引方法',
    width: '150px',
    component: 'select',
    select: {
      options: ['BTREE', 'HASH'],
      clearable: true
    }
  },
  {
    prop: 'comment',
    label: '注释',
    component: 'input',
    componentProp: {
      maxlength: 1000
    }
  }
] as TableColumnOption[]

onMounted(() => {
  addRow()
})

defineExpose({
  addRow,
  deleteRow
})
</script>

<template>
  <div class="top-form">
    <EditableTable
      ref="editableTableRef"
      v-model="tableData"
      height="390px"
      row-key="id"
      :columns="tableColumns"
      @row-contextmenu="rowContextmenu"
    >
      <template #column-fields="{ row, isShowComponent }">
        <div
          v-if="row.fields"
          style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: space-between"
        >
          <div
            class="dbtu-text-ellipsis row-readonly-text"
            style="flex: 1"
          >
            {{ getFieldText(row.fields) }}
          </div>
          <SelectFields
            v-show="isShowComponent()"
            v-model="row.fields"
            :fields="props.tableFields"
          />
        </div>
      </template>
    </EditableTable>
  </div>

  <div class="bottom-form">
    <el-form
      v-if="getCurrentRow().value"
      :model="getCurrentRow().value!"
      label-width="100px"
      label-position="left"
      style="width: 500px"
    >
      <el-form-item label="键块大小">
        <el-input-number
          v-model="getCurrentRow().value!.keyBlockSize"
          :controls="false"
          style="width: 100%"
          class="el-input-number__text-left"
        />
      </el-form-item>
      <el-form-item label="解析器">
        <el-input
          v-model="getCurrentRow().value!.parser"
          :disabled="getCurrentRow().value!.indexType !== 'FULLTEXT'"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/css-style/el-table-editable';

.top-form {
  width: 100%;
  height: 400px;
}

.bottom-form {
  width: 100%;
  height: calc(100% - 400px);
  border-top: 1px solid var(--dbtu-divide-borer-color);
  padding: 10px 0;
}

.set-field-popover {
  width: 100%;
  height: 400px;

  .popover-content {
    width: 100%;
    height: calc(100% - 34px);
  }

  .popover-footer {
    width: 100%;
    height: 34px;
    display: flex;
    align-items: center;
  }
}
</style>
