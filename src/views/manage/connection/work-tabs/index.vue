<!--
 * 工作台选项卡
 *
 * @author Junpeng.Li
 * @date 2023-07-21 09-48
-->
<script setup lang="ts">
import type { TabPaneName } from 'element-plus'
import ObjectPane from './object-pane.vue'
import { useWorkTabStore } from '@/stores/WorkTabStore'
import { MessageBox } from '@/components/element-plus/el-feedback-util'
import { TooltipShowAfter } from '@/components/element-plus/elemenet-plus-util'

defineOptions({
  name: 'ConnectionWorkTabsComponent'
})

const workTabStore = useWorkTabStore()

const onRemoveTab = (name: TabPaneName) => {
  if (workTabStore.tabs[name].saveFlag) {
    MessageBox.confirm({
      msg: '有未保存的数据，你确定要关闭选项卡吗？',
      title: '确认关闭',
      useLoading: true,
      loadingText: '正在关闭',
    }, (done) => {
      workTabStore.closeById(name as string)
      done()
    })
  } else {
    workTabStore.closeById(name as string)
  }
}
</script>

<template>
  <div class="tabs-container">
    <el-tabs
      v-model="workTabStore.activeTabId"
      type="border-card"
      style="width: 100%;height: 100%;"
      @tab-remove="onRemoveTab"
    >
      <el-tab-pane label="&emsp;对象&emsp;" name="object-pane">
        <object-pane/>
      </el-tab-pane>
      <el-tab-pane
        v-for="tab in workTabStore.tabs"
        :name="tab.id"
        closable
      >
        <template #label>
          <el-tooltip
            :content="tab.label"
            :enterable="false"
            :show-after="TooltipShowAfter"
          >
            <span class="dbtu-text-ellipsis tab-label">{{ tab.saveFlag ? '* &ensp;' + tab.label : tab.label }}</span>
          </el-tooltip>
        </template>
        <component :is="tab.component" :data="tab.props"/>
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
          height: calc(100% - 15px);
        }
      }
    }

    &.el-tabs--top.el-tabs--border-card > .el-tabs__header .el-tabs__item:nth-child(2):not(.is-active).is-closable:hover {
      padding-left: 20px;
    }

    .tab-label {
      max-width: 250px;
    }
  }
}
</style>
