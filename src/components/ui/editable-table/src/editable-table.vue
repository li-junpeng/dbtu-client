<!--
 * 基于el-table的可编辑表格
 * 
 * props除本组件外定义的, 还可以直接使用el-table的props
 *
 * @author HuaYu
 * @date 2023-08-09 21:24
-->
<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableRowItem, EditableTableProps, TableColumnOption, TableColumnComponentType } from './editable-table'
import { ElInput, ElInputNumber, ElSelect } from 'element-plus'
import { useComponentRef } from '@/components/element-plus/element-plus-util'
import { EditableTablePropDefaults } from './editable-table'

defineOptions({
  name: 'EditableTable'
})

// @ts-ignore
const props = withDefaults(defineProps<EditableTableProps>(), EditableTablePropDefaults)

// 展示在表格中的数据
const tableRows = defineModel<TableRowItem[]>({
  required: true
})

// 当前选中的行和列
const selectedRow = ref<TableRowItem | null>(null)
const selectedColumn = ref<TableColumn | null>(null)

/**
 * 点击了表格行
 *
 * @param row       行数据
 * @param column    点击的单元格
 */
const onClickRow = (row: TableRowItem, column: TableColumn) => {
  selectedRow.value = row
  selectedColumn.value = column
}

/**
 * 判断是否显示单元格内的表单组件
 *
 * @param column      列配置信息
 * @param component   组件标识
 * @param row         表格行数据信息
 */
const isShowComponent = (column: TableColumnOption, component: TableColumnComponentType, row: TableRowItem): boolean => {
  return (
    selectedRow.value?.[props.rowKey] === row[props.rowKey] &&
    column.component === component &&
    selectedColumn.value?.property === column.prop
  )
}

// 表单组件ref
const inputRef = useComponentRef(ElInput)
const inputNumberRef = useComponentRef(ElInputNumber)
const selectRef = useComponentRef(ElSelect)

// 点击单元格时, 使其变为可编辑状态
watch(
  () => [selectedRow.value, selectedColumn.value],
  () => {
    nextTick(() => {
      const prop = selectedColumn.value?.property
      if (!prop) {
        return
      }

      const column = props.columns.find(item => item.prop === prop)
      if (column) {
        if (column.useSlot) {
          if (!column.slotRef) {
            return
          }
          if (!isRef(column.slotRef)) {
            throw new Error(`EditableTable Column Error: slotRef is not a ref object in ${column.prop} prop`)
          }

          if (Array.isArray(column.slotRef)) {
            // @ts-ignore
            column.slotRef.value?.[0].focus?.()
          } else {
            // @ts-ignore
            column.slotRef.value?.focus?.()
          }
        } else {
          switch (column.component) {
            case 'input':
              // @ts-ignore
              inputRef.value?.[0].focus()
              break
            case 'input-number':
              // @ts-ignore
              inputNumberRef.value?.[0].focus()
              break
            case 'select':
              // @ts-ignore
              selectRef.value?.[0].focus()
              break
          }
        }
      }
    })
  }
)
</script>

<template>
  <el-table
    :data="tableRows"
    border
    highlight-current-row
    :current-row-key="selectedRow?.[props.rowKey]"
    :row-key="props.rowKey"
    scrollbar-always-on
    @row-click="onClickRow"
    class="el-table-editable"
  >
    <!-- 序号列 -->
    <el-table-column
      v-if="props.indexColumn"
      type="index"
      width="50px"
      label="#"
      align="center"
      class-name="bg-is-theme-color"
      style="cursor: pointer"
    >
      <template #default="{ $index }">
        {{ $index + 1 }}
      </template>
    </el-table-column>

    <el-table-column
      v-for="column in props.columns"
      :key="column.prop"
      :label="column.label"
      :prop="column.prop"
      :align="column.align || 'left'"
      :width="column.width"
    >
      <template #default="{ row }">
        <!-- 动态插槽, 插槽名: column-${column.prop} -->
        <slot
          v-if="column.useSlot"
          ref="selectRef"
          :name="`column-${column.prop}`"
          :column="column"
          :row="row"
          :currentRow="selectedRow"
          :currentColumn="selectedColumn"
          :isShowComponent="
            (component: TableColumnComponentType) => {
              return isShowComponent(column, component, row)
            }
          "
        >
          <div style="color: #f00">请自定义插槽: #column-{{ column.prop }}</div>
        </slot>

        <el-input
          v-else-if="isShowComponent(column, 'input', row)"
          ref="inputRef"
          v-model="row[column.prop]"
        />

        <el-input-number
          v-else-if="isShowComponent(column, 'input-number', row)"
          ref="inputNumberRef"
          v-model="row[column.prop]"
          :controls="false"
          :class="{
            'el-input-number__text-left': column.align !== 'center'
          }"
          style="width: 100%"
        />

        <el-checkbox
          v-else-if="column.component === 'checkbox'"
          v-model="row[column.prop]"
          :true-label="column.checkbox?.trueValue"
          :false-label="column.checkbox?.falseValue || ''"
        />

        <el-switch
          v-else-if="column.component === 'switch'"
          size="small"
          v-model="row[column.prop]"
          :active-value="column.switch?.trueValue || true"
          :inactive-value="column.switch?.falseValue || false"
        />

        <el-select
          v-else-if="isShowComponent(column, 'select', row)"
          ref="selectRef"
          v-model="row[column.prop]"
          :clearable="column.select?.clearable || false"
          :filterable="column.select?.filterable || false"
          :placeholder="column.select?.placeholder || ' '"
          style="width: 100%"
        >
          <el-option
            v-for="item in column.select?.options"
            :key="column.select!.valueKey ? item[column.select!.valueKey] : item"
            :value="column.select!.valueKey ? item[column.select!.valueKey] : item"
            :label="column.select!.labelKey ? item[column.select!.labelKey] : item"
          />
        </el-select>

        <!-- 文本显示 -->
        <span
          v-else
          class="row-readonly-text"
        >
          {{ row[column.prop] }}
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<style lang="scss">
.el-table {
  &.el-table--border {
    &.el-table-editable {
      .el-table__body tr.current-row > td.el-table__cell {
        background-color: transparent;

        /* current row of cell, background-color is --dbtu-theme-active-color */
        &.bg-is-theme-color {
          background-color: var(--dbtu-theme-hover-color);
          color: #fff;
        }
      }

      &.el-table--enable-row-transition .el-table__body td.el-table__cell {
        transition: background-color 0s ease;
        -webkit-transition: background-color 0s ease;
        -moz-transition: background-color 0s ease;
        -ms-transition: background-color 0s ease;
        -o-transition: background-color 0s ease;
      }

      .el-table__cell {
        padding: 5px 0;
      }

      .el-table__row {
        .el-table__cell {
          padding: 0;

          .cell {
            padding: 0;
          }
        }
      }

      .el-input {
        --el-input-height: 33px;
        line-height: 33px;

        .el-input__wrapper {
          box-shadow: none;

          &.is-focus {
            background-color: var(--dbtu-theme-hover-color);

            .el-input__inner {
              color: var(--el-color-white);
            }
          }
        }

        .el-input-group__append {
          box-shadow: none;
        }
      }

      .el-select {
        .el-input__wrapper.is-focus {
          box-shadow: none !important;

          .el-select__icon {
            color: var(--el-color-white);
          }
        }
        .el-input {
          .el-select__caret.is-reverse {
            color: var(--el-color-white);
          }

          &.is-focus {
            --el-select-input-color: var(--el-color-white);
            --el-text-color-placeholder: rgba(255, 255, 255, 0.6);
            .el-input__inner {
              color: var(--el-color-white);
            }

            .el-input__suffix {
              color: var(--el-color-white);
            }

            .el-input__wrapper {
              box-shadow: none !important;
            }
          }
        }
      }

      .row-readonly-text {
        padding: 0 11px;
        line-height: 33px;
        cursor: default;
      }
    }
  }
}
</style>
