<!--
 * 表触发器设置
 *
 * @author HuaYu
 * @date 2023-08-03 09:32
-->
<script setup lang="ts">
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { ElInput } from 'element-plus'
import { useComponentRef } from '@/components/element-plus/element-plus-util'
import Contextmenu from '@/components/ui/contextmenu'
import { ArrayUtils } from '@/common/utils/ArrayUtils'
import { MessageBox } from '@/components/element-plus/el-feedback-util'
import MonacoEditor from '@/components/ui/monaco-editor/index.vue'

type TableColumn = TableColumnCtx<unknown>

defineOptions({
  name: 'MySQLTableTriggerSettingComponent'
})

const tableData = defineModel<MySqlTableTrigger[]>({
  required: true
})
const selectedRow = ref<MySqlTableTrigger | null>(null)
const selectedColumn = ref<TableColumn | null>(null)
const nameInputRef = useComponentRef(ElInput)
const rowSql = ref('')

watch(
  () => rowSql.value,
  () => {
    selectedRow.value && (selectedRow.value.sql = rowSql.value)
  }
)

watch(
  () => selectedRow.value,
  () => {
    rowSql.value = selectedRow.value?.sql || ''
  }
)

/**
 * 添加触发器
 *
 * @param index  指定在列表中的位置, 默认在末尾添加
 */
const addRow = (index?: number) => {
  const defaultData: MySqlTableTrigger = { id: Date.now(), name: '' }
  if (index === 0) {
    index = void 0
  }
  if (index !== undefined) {
    tableData.value.splice(index, 0, defaultData)
    selectedRow.value = tableData.value[index]
  } else {
    tableData.value.push(defaultData)
    selectedRow.value = tableData.value[tableData.value.length - 1]
  }
}

/**
 * 插入触发器
 */
const appendRow = () => {
  addRow(ArrayUtils.indexOf(tableData.value, selectedRow.value?.id, 'id'))
}

/**
 * 复制触发器
 */
const copyRow = () => {
  if (!selectedRow.value) {
    return
  }

  tableData.value.push({
    ...selectedRow.value,
    id: Date.now()
  })
  selectedRow.value = tableData.value[tableData.value.length - 1]
}

/**
 * 删除触发器
 */
const deleteRow = () => {
  if (!selectedRow.value) {
    return
  }

  MessageBox.deleteConfirm('您确认要删除触发器吗？', done => {
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

/**
 * 上移
 */
const moveUpRow = () => {
  if (!selectedRow.value) {
    return
  }

  ArrayUtils.moveUp(tableData.value, selectedRow.value, 'id')
}

/**
 * 下移
 */
const moveDownRow = () => {
  if (!selectedRow.value) {
    return
  }

  ArrayUtils.moveDown(tableData.value, selectedRow.value, 'id')
}

// el-table @click-row
const onClickRow = (row: MySqlTableTrigger, column: TableColumn) => {
  selectedRow.value = row
  selectedColumn.value = column
}

// el-table-column @row-contextmenu
const rowContextmenu = (row: MySqlTableTrigger, column: TableColumn, event: MouseEvent) => {
  event.preventDefault()
  selectedRow.value = row
  selectedColumn.value = column
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
      }
    })
  }
)

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
            :maxlength="100"
            autofocus
          />
          <span
            v-else
            class="row-readonly-text"
          >
            {{ row['name'] }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="触发"
        prop="trigger"
        width="150px"
      >
        <template #default="{ row }">
          <el-select
            v-if="selectedRow?.id === row.id"
            v-model="row.trigger"
            clearable
            placeholder=" "
            style="width: 100%"
          >
            <el-option
              v-for="item in ['AFTER', 'BEFORE']"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
          <span
            v-else
            class="row-readonly-text"
          >
            {{ row['trigger'] }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="插入"
        width="100px"
        align="center"
      >
        <template #default="{ row }">
          <el-checkbox
            v-model="row.timing"
            true-label="INSERT"
            :false-label="''"
          />
        </template>
      </el-table-column>

      <el-table-column
        label="更新"
        width="100px"
        align="center"
      >
        <template #default="{ row }">
          <el-checkbox
            v-model="row.timing"
            true-label="UPDATE"
            :false-label="''"
          />
        </template>
      </el-table-column>

      <el-table-column
        label="删除"
        width="100px"
        align="center"
      >
        <template #default="{ row }">
          <el-checkbox
            v-model="row.timing"
            true-label="DELETE"
            :false-label="''"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="bottom-sql">
    <MonacoEditor
      v-if="selectedRow"
      v-model="rowSql"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/css-style/el-table-editable';

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
@/components/element-plus/element-plus-util