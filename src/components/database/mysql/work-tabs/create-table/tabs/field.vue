<!--
 * 字段
 *
 * @author Junpeng.Li
 * @date 2023-07-29 22:12
-->
<script setup lang="ts">
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { ElInput, ElInputNumber, ElSelect } from 'element-plus'
import { MySQLDataType } from '@/common/constants/DataTypeConstant'
import { ArrayUtils } from '@/common/utils/ArrayUtils'
import { MessageBox } from '@/components/element-plus/el-feedback-util'
import { useComponentRef } from '@/components/element-plus/element-plus-util'
import Contextmenu from '@/components/ui/contextmenu'
import FieldOption from './field-option.vue'

type TableColumn = TableColumnCtx<unknown>

defineOptions({
  name: 'MySQLCreateTableTabPaneComponent'
})

const modelValue = defineModel<MySqlTableField[]>({
  default: []
})

const selectedRow = ref<MySqlTableField | null>(null)
const selectedColumn = ref<TableColumn | null>()

// 表单组件ref
const fieldInputRef = useComponentRef(ElInput)
const maxLengthInputRef = useComponentRef(ElInputNumber)
const decimalPointInputRef = useComponentRef(ElInputNumber)
const commentInputRef = useComponentRef(ElInput)

const onClickRow = (row: MySqlTableField, column: TableColumn) => {
  selectedRow.value = row
  selectedColumn.value = column
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

  selectedColumn.value = null
  if (index) {
    selectedRow.value = modelValue.value[index]
  } else {
    selectedRow.value = modelValue.value[modelValue.value.length - 1]
  }
}

// 删除字段
const deleteField = () => {
  if (!selectedRow.value) {
    return
  }

  MessageBox.deleteConfirm('您确认要删除字段吗？', done => {
    const b = ArrayUtils.remove(modelValue.value, selectedRow.value!.id, 'id')
    if (b && modelValue.value.length === 0) {
      addField()
    }
    selectedRow.value = modelValue.value[0]
    done()
  })
}

// 插入字段
const appendField = () => {
  if (!selectedRow.value) {
    return
  }
  const index = ArrayUtils.indexOf(modelValue.value, selectedRow.value.id, 'id')
  if (index < 0) {
    return
  }
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
  selectedRow.value = modelValue.value[modelValue.value.length - 1]
}

/**
 * 上移
 *
 * @param row   需要往上移动的字段
 */
const moveUpField = (row?: MySqlTableField) => {
  if (!row) {
    row = selectedRow.value!
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
    row = selectedRow.value!
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
    if (!selectedRow.value) {
      return
    }
    selectedRow.value.pk = !selectedRow.value.pk
    handleField(selectedRow.value)
  }
}

// 优化: 当行被选中时，立刻使其列中的输入框获取焦点
watch(
  () => [selectedRow.value, selectedColumn.value],
  () => {
    nextTick(() => {
      const column = selectedColumn.value
      switch (column?.property) {
        case 'field':
          fieldInputRef.value?.focus()
          break
        case 'maxLength':
          maxLengthInputRef.value?.focus()
          break
        case 'decimalPoint':
          decimalPointInputRef.value?.focus()
          break
        case 'comment':
          commentInputRef.value?.focus()
          break
      }
    })
  }
)

const rowContextmenu = (row: MySqlTableField, column: TableColumn, event: MouseEvent) => {
  event.preventDefault()
  selectedRow.value = row
  selectedColumn.value = column

  // 数据类型列禁用右键菜单
  if (selectedColumn.value?.property === 'dataType') {
    return
  }

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
  selectedRow.value && (selectedRow.value.options = option)
}

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
  selectedRow.value = modelValue.value[0]
})
</script>

<template>
  <div class="top-form">
    <el-table
      :data="modelValue"
      :current-row-key="selectedRow?.id"
      border
      height="390px"
      row-key="id"
      highlight-current-row
      scrollbar-always-on
      @row-click="onClickRow"
      @row-contextmenu="rowContextmenu"
      class="el-table-editable"
    >
      <el-table-column
        type="index"
        width="50"
        align="center"
        class-name="bg-is-theme-color"
      >
        <template #default="{ row, $index }">
          <span
            v-if="selectedRow?.id !== row.id"
            class="dbtu-un-user-select"
            style="padding: 0 12px"
            >{{ $index + 1 }}</span
          >
          <el-icon v-else>
            <IconEditPen />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column
        label="字段名"
        prop="field"
        width="300px"
      >
        <template #default="{ row }">
          <el-input
            v-if="selectedRow?.id === row.id"
            ref="fieldInputRef"
            v-model="row.field"
            :maxlength="100"
            autofocus
          />
          <span
            v-else
            class="row-readonly-text"
            >{{ row['field'] }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        prop="dataType"
        width="180px"
      >
        <template #default="{ row }">
          <el-select
            v-if="selectedRow?.id === row.id"
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
            >{{ row['dataType'] }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="长度"
        prop="maxLength"
        width="140px"
      >
        <template #default="{ row }">
          <el-input-number
            v-if="selectedRow?.id === row.id"
            ref="maxLengthInputRef"
            v-model="row.maxLength"
            :controls="false"
            :min="0"
            class="el-input-number__text-left"
            style="width: 100%"
          />
          <span
            v-else
            class="row-readonly-text"
            >{{ row['maxLength'] }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="小数点"
        prop="decimalPoint"
        width="140px"
      >
        <template #default="{ row }">
          <el-input-number
            v-if="selectedRow?.id === row.id"
            ref="decimalPointInputRef"
            v-model="row.decimalPoint"
            :controls="false"
            :min="0"
            class="el-input-number__text-left"
            style="width: 100%"
          />
          <span
            v-else
            class="row-readonly-text"
            >{{ row['decimalPoint'] }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="不是null"
        prop="notNull"
        width="80px"
        align="center"
      >
        <template #default="{ row }">
          <el-checkbox
            v-model="row.notNull"
            :true-label="1"
            :false-label="0"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="虚拟"
        prop="virtual"
        width="80px"
        align="center"
      >
        <template #default="{ row }">
          <el-checkbox
            v-model="row.virtual"
            :true-label="1"
            :false-label="0"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="主键"
        prop="pk"
        width="80px"
        align="center"
      >
        <template #default="{ row }">
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
      </el-table-column>
      <el-table-column
        label="注释"
        prop="comment"
      >
        <template #default="{ row }">
          <el-input
            v-if="selectedRow?.id === row.id"
            ref="commentInputRef"
            v-model="row.comment"
          />
          <span
            v-else
            class="row-readonly-text"
            >{{ row['comment'] }}</span
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="bottom-field-option">
    <el-scrollbar>
      <field-option
        v-if="selectedRow"
        :field="selectedRow"
        @change-option="onChangeOption"
      />
    </el-scrollbar>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/css-style/el-table-editable';

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
@/components/element-plus/element-plus-util