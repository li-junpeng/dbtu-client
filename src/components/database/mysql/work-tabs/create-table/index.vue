<!--
 * 创建表
 *
 * @author Junpeng.Li
 * @date 2023-07-29 21:
-->
<script setup lang="ts">
import type { CreateTableProp } from './index'
import { TabNames, DATABASE_PROVIDE_KEY } from './index'
import { useComponentRef } from '@/components/element-plus/element-plus-util'
import SqlCodePreview from '@/components/ui/sql-code-preview/index.vue'

// toolbox components
import FieldToolbox from './toolbox/field.vue'
import IndexToolbox from './toolbox/index.vue'
import FkToolbox from './toolbox/fk.vue'
import TriggerToolbox from './toolbox/trigger.vue'

// tab-pane components
import FieldTabPane from './tabs/field.vue'
import TableOption from './tabs/table-option.vue'
import { TableOptionDefault } from './tabs/table-option'
import TableTrigger from './tabs/table-trigger.vue'
import TableIndex from './tabs/table-index.vue'
import TableForeignKeys from './tabs/table-foreign-keys.vue'

import { genCreateTableSql } from '../../sql-preview-gen'

defineOptions({
  name: 'MySQLCreateTableComponent'
})

const props = defineProps<CreateTableProp>()
const tab = reactive({
  selected: TabNames.field
})

// 往下层组件提供当前的数据库信息
provide(DATABASE_PROVIDE_KEY, props.database)

// 表字段
const tableFields = reactive<MySqlTableField[]>([
  {
    id: 1,
    field: 'id',
    dataType: 'int',
    maxLength: 10,
    decimalPoint: 0,
    notNull: 1,
    virtual: 0,
    pk: true,
    options: {}
  },
  {
    id: 2,
    field: 'name',
    dataType: 'varchar',
    maxLength: 64,
    decimalPoint: 0,
    notNull: 0,
    virtual: 0,
    pk: false,
    options: {}
  },
  {
    id: 3,
    field: 'user_name',
    dataType: 'varchar',
    maxLength: 64,
    decimalPoint: 0,
    notNull: 0,
    virtual: 0,
    pk: false,
    options: {}
  }
])
// 索引
const tableIndexes = reactive<MySqlTableIndex[]>([])
// 外键
const tableForeignKeys = reactive<MySqlTableForeignKey[]>([])
// 表触发器
const tableTriggers = reactive<MySqlTableTrigger[]>([])
// 表属性信息
const tableOption = reactive<MySqlTableOption>({
  ...TableOptionDefault
})
// 表注释内容
const tableCommentText = ref('')

// SQL预览的内容
const sqlCode = ref('')

const fieldTabPaneRef = useComponentRef(FieldTabPane)
const tableForeignKeysRef = useComponentRef(TableForeignKeys)
const tableTriggerRef = useComponentRef(TableTrigger)
const tableIndexRef = useComponentRef(TableIndex)

// 动态生成SQL预览内容
const tableFieldSql = computed(() => {
  return genCreateTableSql(props.database, tableFields)
})

watch(
  () => [tableFieldSql.value],
  () => {
    sqlCode.value = ''
    sqlCode.value += tableFieldSql.value
  }
)
</script>

<template>
  <!-- 头部工具栏 -->
  <div class="toolbox">
    <el-button
      text
      link
      @click="
        () => {
          console.log(tableForeignKeys)
        }
      "
    >
      <template #icon>
        <IconCollection />
      </template>
      <span>保存</span>
    </el-button>
    <div
      class="item-divided"
      v-show="![TabNames.option, TabNames.comment, TabNames.sql_preview].includes(tab.selected)"
    ></div>
    <field-toolbox
      v-show="tab.selected === TabNames.field"
      :tab-pane-ref="fieldTabPaneRef"
    />
    <index-toolbox
      v-show="tab.selected === TabNames.index"
      :tab-pane-ref="tableIndexRef"
    />
    <fk-toolbox
      v-show="tab.selected === TabNames.fk"
      :tab-pane-ref="tableForeignKeysRef"
    />
    <trigger-toolbox
      v-show="tab.selected === TabNames.trigger"
      :tab-pane-ref="tableTriggerRef"
    />
  </div>

  <!-- tabs -->
  <div class="tabs-box">
    <el-tabs
      v-model="tab.selected"
      style="--el-tab-pane-width: 80px; width: 100%; height: 100%"
    >
      <el-tab-pane
        label="字段"
        :name="TabNames.field"
      >
        <FieldTabPane
          ref="fieldTabPaneRef"
          v-model="tableFields"
        />
      </el-tab-pane>
      <el-tab-pane
        label="索引"
        :name="TabNames.index"
      >
        <TableIndex
          v-model="tableIndexes"
          :table-fields="tableFields"
          ref="tableIndexRef"
        />
      </el-tab-pane>
      <el-tab-pane
        label="外键"
        :name="TabNames.fk"
      >
        <TableForeignKeys
          ref="tableForeignKeysRef"
          v-model="tableForeignKeys"
          :table-fields="tableFields"
        />
      </el-tab-pane>
      <el-tab-pane
        label="触发器"
        :name="TabNames.trigger"
      >
        <TableTrigger
          ref="tableTriggerRef"
          v-model="tableTriggers"
        />
      </el-tab-pane>
      <el-tab-pane
        label="选项"
        :name="TabNames.option"
      >
        <TableOption v-model="tableOption" />
      </el-tab-pane>
      <el-tab-pane
        label="注释"
        :name="TabNames.comment"
      >
        <el-input
          v-model="tableCommentText"
          :maxlength="1000"
          show-word-limit
          type="textarea"
          resize="none"
          :autosize="{
            minRows: 10
          }"
        />
      </el-tab-pane>
      <el-tab-pane
        label="SQL预览"
        :name="TabNames.sql_preview"
      >
        <SqlCodePreview :code="sqlCode" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.toolbox {
  width: 100%;
  height: 34px;
  display: flex;
  align-items: center;
  padding: 0 10px;

  .toolbox-item {
    display: flex;
    height: 34px;
    align-items: center;
  }

  :deep(.item-divided) {
    width: 1px;
    height: 14px;
    background-color: var(--dbtu-font-color-disabled);
    margin: 0 10px;
  }
}

.tabs-box {
  width: 100%;
  height: calc(100% - 40px);
  padding: 0 10px;
}
</style>
