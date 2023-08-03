<!--
 * 索引
 *
 * @author Junpeng.Li
 * @date 2023-07-29 22:
-->
<script setup lang="ts">
import TableIndex from '../tabs/table-index.vue'

defineOptions({
  name: 'MySQLCreateTableIndexToolboxComponent'
})

const props = defineProps<{
  tabPaneRef?: InstanceType<typeof TableIndex>
}>()

const addIndex = () => {
  props.tabPaneRef?.addRow()
}

const deleteIndex = () => {
  props.tabPaneRef?.deleteRow()
}
</script>

<template>
  <div class="toolbox-item">
    <el-button
      text
      link
      @click="addIndex"
    >
      <template #icon>
        <IconCirclePlus />
      </template>
      <span>添加索引</span>
    </el-button>
    <el-button
      text
      link
      @click="deleteIndex"
    >
      <template #icon>
        <IconDelete />
      </template>
      <span>删除索引</span>
    </el-button>
  </div>
</template>

<style scoped lang="scss"></style>
