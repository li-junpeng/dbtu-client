<!--
 * 表索引设置
 *
 * @author HuaYu
 * @date 2023-08-03 14:26
-->
<script setup lang="ts">
import { ArrayUtils } from '@/common/utils/ArrayUtils'
import { ElInput, type TableColumnCtx } from 'element-plus'
import { useComponentRef } from '@/components/element-plus/elemenet-plus-util'
import { IndexTypes } from '@/common/constants/MySqlConstant'
import Contextmenu from '@/components/ui/contextmenu'
import { MessageBox } from '@/components/element-plus/el-feedback-util'

type TableColumn = TableColumnCtx<any>

defineOptions({
  name: 'MySQLTableIndexSettingComponent'
})

const tableData = reactive<MySqlTableIndex[]>([])
const selectedRow = ref<MySqlTableIndex | null>(null)
const selectedColumn = ref<TableColumn | null>(null)

const nameInputRef = useComponentRef(ElInput)
const fieldsInputRef = useComponentRef(ElInput)
const commentInputRef = useComponentRef(ElInput)

// 添加索引
const addRow = () => {
  tableData.push({
    id: Date.now(),
    name: '',
    fields: ''
  })
  selectedRow.value = tableData[tableData.length - 1]
}

// 删除索引
const deleteRow = () => {
  if (!selectedRow.value) {
    return
  }

  MessageBox.deleteConfirm('您确定要删除索引吗？', done => {
    const b = ArrayUtils.remove(tableData, selectedRow.value!.id, 'id')
    if (b) {
      if (tableData.length === 0) {
        addRow()
      } else {
        selectedRow.value = tableData[0]
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
          <el-input
            v-if="selectedRow?.id === row.id"
            ref="fieldsInputRef"
            v-model="row.fields"
            disabled
          >
            <template #append>
              <el-button
                text
                link
              >
                <template #icon>
                  <IconMoreFilled />
                </template>
              </el-button>
            </template>
          </el-input>
          <span
            v-else
            class="row-readonly-text"
          >
            {{ row.fields }}
          </span>
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

  <div class="bottom-form"></div>
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
</style>
