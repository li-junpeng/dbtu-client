<!--
 * MySQL 数据表列表 tab pane
 *
 * @author Junpeng.Li
 * @date 2023-07-21 11-16
-->
<script setup lang="ts">
import { type ObjectPaneProps } from '@/views/manage/connection/work-tabs/object-pane'
import { ElButton } from 'element-plus'
import {
  FolderOpened as IconFolderOpened,
  EditPen as IconEditPen,
  CirclePlus as IconCirclePlus,
  Delete as IconDelete
} from '@element-plus/icons-vue'
import IconDbImport from '@/icons/svg/db-import.vue'
import IconDbExport from '@/icons/svg/db-export.vue'

defineOptions({
  name: 'MySQLWorkTabObjectPaneComponent'
})

const props = defineProps<ObjectPaneProps<TableNode>>()
</script>

<template>
  <div class="header-toolbox">
    <el-button
      text
      link
      :icon="IconFolderOpened"
      disabled
    >
      <span>打开表</span>
    </el-button>
    <el-button
      text
      link
      :icon="IconEditPen"
      disabled
    >
      <span>设计表</span>
    </el-button>
    <el-button
      text
      link
      :icon="IconCirclePlus"
    >
      <span>新建表</span>
    </el-button>
    <el-button
      text
      link
      :icon="IconDelete"
      disabled
    >
      <span>删除表</span>
    </el-button>
    <el-button
      text
      link
      :icon="IconDbImport"
    >
      <span>导入向导</span>
    </el-button>
    <el-button
      text
      link
      :icon="IconDbExport"
    >
      <span>导出向导</span>
    </el-button>
  </div>
</template>

<style scoped lang="scss">
.header-toolbox {
  width: 100%;
  height: 40px;
  border-bottom: 1px solid var(--dbtu-divide-borer-color);
  display: flex;
  align-items: center;
  padding: 0 10px;
}
</style>
