<!--
 * 创建表
 *
 * @author Junpeng.Li
 * @date 2023-07-29 21:
-->
<script setup lang="ts">
import type { CreateTableProp } from './index'
import { TabNames } from './index'
import SqlCodePreview from '@/components/ui/sql-code-preview/index.vue'

// toolbox components
import FieldToolbox from './toolbox/field.vue'
import IndexToolbox from './toolbox/index.vue'
import FkToolbox from './toolbox/fk.vue'
import TriggerToolbox from './toolbox/trigger.vue'

// tab-pane components
import FieldTabPane from './tabs/field.vue'
import { useComponentRef } from '@/components/element-plus/elemenet-plus-util'

defineOptions({
  name: 'MySQLCreateTableComponent'
})

defineProps<CreateTableProp>()
const tab = reactive({
  selected: TabNames.field
})
// SQL预览所使用的SQL语句
const sqlCode = ref('')
const fieldTabPaneRef = useComponentRef(FieldTabPane)
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
    <index-toolbox v-show="tab.selected === TabNames.index" />
    <fk-toolbox v-show="tab.selected === TabNames.fk" />
    <trigger-toolbox v-show="tab.selected === TabNames.trigger" />
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
      </el-tab-pane>
      <el-tab-pane
        label="选项"
        :name="TabNames.option"
      >
      </el-tab-pane>
      <el-tab-pane
        label="注释"
        :name="TabNames.comment"
      >
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
