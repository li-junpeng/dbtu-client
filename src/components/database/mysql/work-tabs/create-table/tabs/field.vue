<!--
 * 表字段
 *
 * @author Junpeng.Li
 * @date 2023-07-29 22:12
-->
<script setup lang="ts">
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { ElSelect } from 'element-plus'
import { MySQLDataType } from '@/common/constants/DataTypeConstant'
import { ArrayUtils } from '@/common/utils/ArrayUtils'
import { MessageBox } from '@/components/element-plus/el-feedback-util'
import { useComponentRef } from '@/components/element-plus/element-plus-util'
import EditableTable, { type TableColumnOption } from '@/components/ui/editable-table'
import Contextmenu from '@/components/ui/contextmenu'
import FieldOption from './field-option.vue'

type TableColumn = TableColumnCtx<unknown>

defineOptions({
  name: 'MySQLCreateTableTabPaneComponent'
})

const modelValue = defineModel<MySqlTableField[]>({
  default: []
})

const editableTableRef = useComponentRef(EditableTable)
// 表单组件ref
const selectRef = useComponentRef(ElSelect)

const setCurrentRow = (row: MySqlTableField) => {
  editableTableRef.value?.setCurrentRow(row)
}

const getCurrentRow = () => {
  return editableTableRef.value?.getCurrentRow<MySqlTableField>() || ref(null)
}

// 当字段信息改变时，处理字段信息
const handleField = (row: MySqlTableField) => {
  if (row.pk) {
    row.notNull = 1
  }
}

/**
 * 添加字段
 *
 * @param index  指定索引
 */
const addField = (index?: number) => {
  const data = {
    id: Date.now(),
    field: '',
    dataType: '',
    notNull: 0,
    virtual: 0,
    comment: '',
    pk: false,
    decimalPoint: 0,
    options: {}
  } as MySqlTableField
  if (index === 0) {
    index = 1
  }
  if (index === undefined) {
    modelValue.value.push(data)
  } else {
    modelValue.value.splice(index, 0, data)
  }

  if (index) {
    setCurrentRow(modelValue.value[index])
  } else {
    setCurrentRow(modelValue.value[modelValue.value.length - 1])
  }
}

// 删除字段
const deleteField = () => {
  if (!getCurrentRow().value) {
    return
  }

  MessageBox.deleteConfirm('您确认要删除字段吗？', done => {
    const b = ArrayUtils.remove(modelValue.value, getCurrentRow().value?.id, 'id')
    if (b && modelValue.value.length === 0) {
      addField()
    }
    setCurrentRow(modelValue.value[0])
    done()
  })
}

// 插入字段
const appendField = () => {
  if (!getCurrentRow()) {
    return
  }
  const index = ArrayUtils.indexOf(modelValue.value, getCurrentRow().value?.id, 'id')
  if (index < 0) {
    return
  }
  editableTableRef.value?.setCurrentColumn(null)
  addField(index)
}

/**
 * 复制字段
 *
 * @param row  要复制的字段信息
 */
const copyField = (row: MySqlTableField) => {
  modelValue.value.push({
    ...row,
    id: Date.now()
  })
  setCurrentRow(modelValue.value[modelValue.value.length - 1])
}

/**
 * 上移
 *
 * @param row   需要往上移动的字段
 */
const moveUpField = (row?: MySqlTableField) => {
  if (!row) {
    row = getCurrentRow().value!
  }
  const index = ArrayUtils.indexOf(modelValue.value, row.id, 'id')
  if (index >= 1) {
    const beforeField = modelValue.value[index - 1]
    modelValue.value[index - 1] = row
    modelValue.value[index] = beforeField
  }
}

/**
 * 下移
 *
 * @param row   需要往下移的字段
 */
const moveDownField = (row?: MySqlTableField) => {
  if (!row) {
    row = getCurrentRow().value!
  }
  const index = ArrayUtils.indexOf(modelValue.value, row.id, 'id')
  if (index < modelValue.value.length - 1) {
    const afterField = modelValue.value[index + 1]
    modelValue.value[index + 1] = row
    modelValue.value[index] = afterField
  }
}

/**
 * 修改主键状态
 *
 * @param row  如果不指定字段，则默认以当前选择的字段为准
 */
const triggerPrimaryKey = (row?: MySqlTableField) => {
  if (row) {
    row.pk = !row.pk
    handleField(row)
  } else {
    const selectedRow = getCurrentRow()
    if (!selectedRow?.value) {
      return
    }
    selectedRow.value.pk = !selectedRow.value.pk
    handleField(selectedRow.value)
  }
}

const rowContextmenu = (row: MySqlTableField, column: TableColumn, event: MouseEvent) => {
  event.preventDefault()
  setCurrentRow(row)
  editableTableRef.value?.setCurrentColumn(null)
  Contextmenu({
    event,
    menus: [
      {
        label: '添加字段',
        onClick: () => {
          addField()
        }
      },
      {
        label: '插入字段',
        onClick: () => {
          appendField()
        }
      },
      {
        label: '复制字段',
        onClick: () => {
          copyField(row)
        }
      },
      {
        label: '删除字段',
        divided: true,
        onClick: () => {
          deleteField()
        }
      },
      {
        label: '主键',
        divided: true,
        onClick: () => {
          triggerPrimaryKey(row)
        }
      },
      {
        label: '上移',
        onClick: () => {
          moveUpField(row)
        }
      },
      {
        label: '下移',
        onClick: () => {
          moveDownField(row)
        }
      }
    ]
  })
}

/**
 * 当改变了数据类型的值后，修改对应的数据长度以及归零小数点
 *
 * @param row   字段信息
 */
const onChangeDataType = (row: MySqlTableField) => {
  row.maxLength = void 0
  row.decimalPoint = 0

  if (!row.dataType) {
    return
  }

  row.maxLength = MySQLDataType[row.dataType].default
}

// 更新字段的属性值
const onChangeOption = (option: Record<string, any>) => {
  getCurrentRow().value && (getCurrentRow().value!.options = option)
}

const tableColumns = [
  {
    prop: 'field',
    label: '字段名',
    width: '300px',
    component: 'input',
    componentProp: {
      maxlength: 100
    }
  },
  {
    prop: 'dataType',
    label: '类型',
    width: '180px',
    component: 'select',
    useSlot: true,
    slotRef: selectRef
  },
  {
    prop: 'maxLength',
    label: '长度',
    width: '140px',
    component: 'input-number',
    componentProp: {
      min: 0,
      precision: 0
    }
  },
  {
    prop: 'decimalPoint',
    label: '小数点',
    width: '140px',
    component: 'input-number',
    componentProp: {
      min: 0,
      precision: 0
    }
  },
  {
    prop: 'notNull',
    label: '不是null',
    width: '80px',
    align: 'center',
    component: 'checkbox',
    checkbox: {
      trueValue: 1,
      falseValue: 0
    }
  },
  {
    prop: 'virtual',
    label: '虚拟',
    width: '80px',
    align: 'center',
    component: 'checkbox',
    checkbox: {
      trueValue: 1,
      falseValue: 0
    }
  },
  {
    prop: 'pk',
    label: '主键',
    width: '80px',
    align: 'center',
    component: 'text',
    useSlot: true
  },
  {
    prop: 'comment',
    label: '注释',
    component: 'input'
  }
] as TableColumnOption[]

defineExpose({
  addField,
  deleteField,
  appendField,
  triggerPrimaryKey,
  moveUpField,
  moveDownField
})

onMounted(() => {
  addField()
  setCurrentRow(modelValue.value[0])
})
</script>

<template>
  <div class="top-form">
    <EditableTable
      ref="editableTableRef"
      v-model="modelValue"
      :columns="tableColumns"
      row-key="id"
      height="390px"
      @row-contextmenu="rowContextmenu"
    >
      <template #column-dataType="{ row, isShowComponent }">
        <el-select
          v-if="isShowComponent('select')"
          ref="selectRef"
          v-model="row.dataType"
          placeholder=" "
          clearable
          filterable
          @change="onChangeDataType(row)"
        >
          <el-option
            v-for="key in Object.keys(MySQLDataType)"
            :key="key"
            :value="key"
            :label="key"
          />
        </el-select>
        <span
          v-else
          class="row-readonly-text"
        >
          {{ row.dataType }}
        </span>
      </template>

      <template #column-pk="{ row }">
        <div
          @click="triggerPrimaryKey(row)"
          style="
            width: 80px;
            height: 33px;
            cursor: pointer;
            color: var(--dbtu-theme-color);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--dbtu-icon-text-gap);
          "
        >
          <el-icon v-if="row.pk">
            <IconKey />
          </el-icon>
        </div>
      </template>
    </EditableTable>
  </div>
  <div class="bottom-field-option">
    <el-scrollbar>
      <field-option
        v-if="getCurrentRow().value"
        :field="getCurrentRow().value!"
        @change-option="onChangeOption"
      />
    </el-scrollbar>
  </div>
</template>

<style scoped lang="scss">
.top-form {
  width: 100%;
  height: 400px;
}

.bottom-field-option {
  width: 100%;
  height: calc(100% - 400px);
  border-top: 1px solid var(--dbtu-divide-borer-color);
}
</style>
