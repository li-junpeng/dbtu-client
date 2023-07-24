<!--
 * 对象选项卡面板
 *
 * @author Junpeng.Li
 * @date 2023-07-21 10-59
-->
<script setup lang="ts">
import { useWorkTabStore } from '@/stores/WorkTabStore'

defineOptions({
  name: 'WorkTabObjectPaneComponent'
})

const workTabStore = useWorkTabStore()
</script>

<template>
  <component
    :is="workTabStore.objectPaneComponent"
    :data="workTabStore.objectPaneProps"
  />
</template>

<style lang="scss">
#pane-object-pane {
  .header-toolbox {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  .table-list-wrapper {
    width: 100%;
    height: calc(100% - 40px);
    color: var(--dbtu-font-color);
    padding: 0 10px;

    .table-list-v2 {
      .el-table-v2__header-row,
      .el-table-v2__row {
        border-bottom: none;
        cursor: default;
      }

      .el-table-v2__row.is-selected,
      .el-table-v2__row:hover {
        background-color: var(--dbtu-hover-color);
      }

      .el-table-v2__header-cell-text {
        color: var(--dbtu-font-color);
      }

      .table-name-cell {
        display: flex;
        align-items: center;
        line-height: 34px;
        gap: var(--dbtu-icon-text-gap);
      }

      .is-selected .table-name-cell {
        color: var(--dbtu-theme-color);
      }
    }
  }
}
</style>

