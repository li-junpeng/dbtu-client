<!--
 * 工作台选项卡
 *
 * @author Junpeng.Li
 * @date 2023-07-21 09-48
-->
<script setup lang="ts">
import { reactive } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import ObjectPane from './object-pane.vue'

defineOptions({
  name: 'ConnectionWorkTabsComponent'
})

const tabs = reactive({
  selected: 'object-pane'
})
</script>

<template>
  <div class="tabs-container">
    <el-tabs
      v-model="tabs.selected"
      type="border-card"
      style="width: 100%;height: 100%;"
    >
      <el-tab-pane label="&emsp;对象&emsp;" name="object-pane">
        <object-pane/>
      </el-tab-pane>
      <el-tab-pane
        v-for="i in 3"
        :label="`表 - ${i} sys_user @localhost`"
        :name="`mysql-tables${i}`"
        closable
      >

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.tabs-container {
  width: 100%;
  height: 100%;
  overflow: hidden;

  :deep(.el-tabs) {
    &.el-tabs--border-card {
      border: none;

      & > .el-tabs__header {
        background-color: transparent;
        border-bottom: 1px solid var(--dbtu-divide-borer-color);

        .el-tabs__item.is-active {
          border-right-color: var(--dbtu-divide-borer-color);
          border-left-color: var(--dbtu-divide-borer-color);
        }
      }

      .el-tabs__content {
        width: 100%;
        height: calc(100% - 39px);
        padding: 0;

        .el-tab-pane {
          width: 100%;
          height: 100%;
        }
      }
    }

    &.el-tabs--top.el-tabs--border-card > .el-tabs__header .el-tabs__item:nth-child(2):not(.is-active).is-closable:hover {
      padding-left: 20px;
    }
  }
}
</style>
