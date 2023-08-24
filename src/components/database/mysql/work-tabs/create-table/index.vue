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
import TableTrigger from './tabs/table-trigger.vue'
import TableIndex from './tabs/table-index.vue'
import TableForeignKeys from './tabs/table-foreign-keys.vue'

import { generateCreateTableSql } from '@/api/database/mysql-database-api'
import { MessageBox } from '@/components/element-plus/el-feedback-util'

defineOptions({
  name: 'MySQLCreateTableComponent'
})

const props = defineProps<CreateTableProp>()
const tab = reactive({
  selected: TabNames.field
})
// 数据是否有变化
const isChange = ref(false)
// 是否需要重新请求来获取SQL预览数据
const isReloadSqlCode = ref(false)

// 往下层组件提供当前的数据库信息
provide(DATABASE_PROVIDE_KEY, props.database)

// 表信息
const tableInfo = reactive<MySqlTableInstance>({
  id: Date.now(),
  name: 'Untitled',
  autoIncrement: 0,
  updateTime: null,
  dataLength: 0,
  rowsNum: 0,
  charSet: props.database.character,
  collate: props.database.collate,
  rowFormat: null,
  database: props.database.name,
  nodeType: 'table_instance',
  comment: null,
  engine: 'InnoDB',
  columns: [],
  indexes: [],
  foreignKeys: []
})

// 表触发器
const tableTriggers = reactive<TableTrigger[]>([])

// SQL预览的内容
const sqlCode = ref('')

const fieldTabPaneRef = useComponentRef(FieldTabPane)
const tableForeignKeysRef = useComponentRef(TableForeignKeys)
const tableTriggerRef = useComponentRef(TableTrigger)
const tableIndexRef = useComponentRef(TableIndex)

// 加载生成SQL语句接口
const loadGenerateSqlCode = async (force: boolean = false) => {
  if (!isReloadSqlCode.value && !force) return

  sqlCode.value = '-- 正在生成SQL语句，请稍等...'
  const { status, message, data } = await generateCreateTableSql(tableInfo, tableTriggers)
  if (status === 'success') {
    sqlCode.value = data!
  } else {
    MessageBox.error(message)
    sqlCode.value = ''
  }
  isReloadSqlCode.value = false
}

watch(
  () => tab.selected,
  tabName => {
    if (tabName === TabNames.sql_preview) {
      loadGenerateSqlCode()
    }
  }
)

watch(
  () => [tableInfo, tableTriggers],
  () => {
    isChange.value = true
    isReloadSqlCode.value = true
  },
  { deep: true }
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
          console.log(tableInfo)
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
      v-show="![TabNames.option, TabNames.comment].includes(tab.selected)"
    ></div>
    <el-button
      v-if="TabNames.sql_preview === tab.selected"
      text 
      link
      @click="loadGenerateSqlCode(true)"
    >
      <template #icon>
        <IconRefresh/>
      </template>
      <span>刷新</span>
    </el-button>
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
          v-model="tableInfo.columns"
        />
      </el-tab-pane>
      <el-tab-pane
        label="索引"
        :name="TabNames.index"
      >
        <TableIndex
          v-model="tableInfo.indexes as MySqlTableIndex[]"
          :table-fields="tableInfo.columns"
          ref="tableIndexRef"
        />
      </el-tab-pane>
      <el-tab-pane
        label="外键"
        :name="TabNames.fk"
      >
        <TableForeignKeys
          ref="tableForeignKeysRef"
          v-model="tableInfo.foreignKeys as MySqlTableForeignKey[]"
          :table-fields="tableInfo.columns"
        />
      </el-tab-pane>
      <el-tab-pane
        label="触发器"
        :name="TabNames.trigger"
      >
        <TableTrigger
          ref="tableTriggerRef"
          v-model="tableTriggers"
          :table-info="tableInfo"
        />
      </el-tab-pane>
      <el-tab-pane
        label="选项"
        :name="TabNames.option"
      >
        <TableOption v-model="tableInfo" />
      </el-tab-pane>
      <el-tab-pane
        label="注释"
        :name="TabNames.comment"
      >
        <el-input
          v-model="tableInfo.comment"
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
