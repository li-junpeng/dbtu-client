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
    v-if="workTabStore.objectPaneComponent"
    :is="workTabStore.objectPaneComponent"
    :data="workTabStore.objectPaneProps"
  />
  <div
    v-else
    class="dbtu-main"
  >DBTu</div>
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
    height: calc(100% - 74px);
    color: var(--dbtu-font-color);
    padding: 0 10px;

    &.no-bottom {
      height: calc(100% - 40px);
    }

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

  .bottom-tip {
    width: 100%;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: left;
    padding: 0 10px;
    color: var(--dbtu-font-color);
    border-top: 1px solid var(--dbtu-divide-borer-color);
    font-size: var(--dbtu-font-size);
    line-height: 1;
    cursor: default;
  }
}

.dbtu-main {
  width: 100%;
  height: 100%;
  font-size: 80px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.1;
}
</style>
