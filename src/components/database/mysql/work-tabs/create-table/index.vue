<!--
 * 创建表
 *
 * @author Junpeng.Li
 * @date 2023-07-29 21:
-->
<script setup lang="ts">
import type { CreateTableProp } from './index'
import { TabNames } from './index'
import { useComponentRef } from '@/components/element-plus/elemenet-plus-util'
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

defineOptions({
  name: 'MySQLCreateTableComponent'
})

defineProps<CreateTableProp>()
const tab = reactive({
  selected: TabNames.field
})
// SQL预览所使用的SQL语句
const sqlCode = ref('')
// 设置触发器生成的SQL语句
const triggerSql = ref('')
const fieldTabPaneRef = useComponentRef(FieldTabPane)
const tableTriggerRef = useComponentRef(TableTrigger)
const tableIndexRef = useComponentRef(TableIndex)
// 表注释内容
const commentText = ref('')
</script>

<template>
  <!-- 头部工具栏 -->
  <div class="toolbox">
    <el-button
      text
      link
      disabled
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
    <fk-toolbox v-show="tab.selected === TabNames.fk" />
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
        <field-tab-pane
          ref="fieldTabPaneRef"
          @change-sql="sql => (sqlCode = sql)"
        />
      </el-tab-pane>
      <el-tab-pane
        label="索引"
        :name="TabNames.index"
      >
        <TableIndex ref="tableIndexRef" />
      </el-tab-pane>
      <el-tab-pane
        label="外键"
        :name="TabNames.fk"
      >
      </el-tab-pane>
      <el-tab-pane
        label="触发器"
        :name="TabNames.trigger"
      >
        <TableTrigger
          ref="tableTriggerRef"
          @change-trigger="data => (triggerSql = data.sql)"
        />
      </el-tab-pane>
      <el-tab-pane
        label="选项"
        :name="TabNames.option"
      >
        <TableOption />
      </el-tab-pane>
      <el-tab-pane
        label="注释"
        :name="TabNames.comment"
      >
        <el-input
          v-model="commentText"
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
        <sql-code-preview :code="sqlCode" />
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
