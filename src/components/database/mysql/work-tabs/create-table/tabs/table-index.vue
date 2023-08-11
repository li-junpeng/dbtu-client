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

type TableColumn = TableColumnCtx<any>

defineOptions({
  name: 'MySQLTableIndexSettingComponent'
})

const props = withDefaults(defineProps<TableIndexProp>(), TableIndexPropDefault)

const tableData = defineModel<MySqlTableIndex[]>({
  required: true
})

const selectedRow = ref<MySqlTableIndex | null>(null)
const selectedColumn = ref<TableColumn | null>(null)

// 表单组件的ref, 目的是用来做组件自动获取焦点使用的
const nameInputRef = useComponentRef(ElInput)
const fieldsInputRef = useComponentRef(ElInput)
const commentInputRef = useComponentRef(ElInput)

// 添加索引
const addRow = () => {
  tableData.value.push({
    id: Date.now(),
    name: '',
    fields: []
  })
  selectedRow.value = tableData.value[tableData.value.length - 1]
}

// 删除索引
const deleteRow = () => {
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

// el-table @row-click
const onClickRow = (row: MySqlTableIndex, column: TableColumn) => {
  selectedRow.value = row
  selectedColumn.value = column
}

// el-table @row-contextmenu
const rowContextmenu = (row: MySqlTableIndex, column: TableColumn, event: MouseEvent) => {
  event.preventDefault()
  onClickRow(row, column)
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

// 优化: 当行被选中时，立刻使其列中的输入框获取焦点
watch(
  () => [selectedRow.value, selectedColumn.value],
  () => {
    nextTick(() => {
      const column = selectedColumn.value
      switch (column?.property) {
        case 'name':
          nameInputRef.value?.focus()
          break
        case 'fields':
          fieldsInputRef.value?.focus()
          break
        case 'comment':
          commentInputRef.value?.focus()
          break
      }
    })
  },
  { deep: true }
)

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
    <el-table
      :data="tableData"
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
        label="名"
        prop="name"
        width="300px"
      >
        <template #default="{ row }">
          <el-input
            v-if="selectedRow?.id === row.id"
            ref="nameInputRef"
            v-model="row.name"
          />
          <span
            v-else
            class="row-readonly-text"
          >
            {{ row.name }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="字段"
        prop="fields"
        width="300px"
      >
        <template #default="{ row }">
          <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: space-between">
            <div
              class="dbtu-text-ellipsis row-readonly-text"
              style="flex: 1"
            >
              {{ getFieldText(row.fields) }}
            </div>
            <SelectFields
              v-show="selectedRow?.id === row.id"
              v-model="row.fields"
              :fields="props.tableFields"
            />
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="索引类型"
        prop="indexType"
        width="150px"
      >
        <template #default="{ row }">
          <el-select
            v-if="selectedRow?.id === row.id"
            v-model="row.indexType"
            clearable
            placeholder=" "
            style="width: 100%"
          >
            <el-option
              v-for="item in IndexTypes"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
          <span
            v-else
            class="row-readonly-text"
          >
            {{ row.indexType }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="索引方法"
        prop="indexMethod"
        width="150px"
      >
        <template #default="{ row }">
          <el-select
            v-if="selectedRow?.id === row.id"
            v-model="row.indexMethod"
            clearable
            placeholder=" "
            style="width: 100%"
          >
            <el-option
              v-for="item in ['BTREE', 'HASH']"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
          <span
            v-else
            class="row-readonly-text"
          >
            {{ row.indexMethod }}
          </span>
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
            :maxlength="1000"
          />
          <span
            v-else
            class="row-readonly-text"
          >
            {{ row.comment }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div class="bottom-form">
    <el-form
      v-if="selectedRow"
      :model="selectedRow"
      label-width="100px"
      label-position="left"
      style="width: 500px"
    >
      <el-form-item label="键块大小">
        <el-input-number
          v-model="selectedRow.keyBlockSize"
          :controls="false"
          style="width: 100%"
          class="el-input-number__text-left"
        />
      </el-form-item>
      <el-form-item label="解析器">
        <el-input
          v-model="selectedRow.parser"
          :disabled="selectedRow.indexType !== 'FULLTEXT'"
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
