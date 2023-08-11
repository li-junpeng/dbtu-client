<!--
 * 外键
 *
 * @author Junpeng.Li
 * @date 2023-07-29 22:
-->
<script setup lang="ts">
import TableForeignKeys from '../tabs/table-foreign-keys.vue'

defineOptions({
  name: 'MySQLCreateTableFkToolboxComponent'
})

const props = defineProps<{
  tabPaneRef?: InstanceType<typeof TableForeignKeys>
}>()

const addFk = () => {
  props.tabPaneRef?.addForeignKey()
}

const deleteFk = () => {
  props.tabPaneRef?.deleteForeignKey()
}
</script>

<template>
  <div class="toolbox-item">
    <el-button
      text
      link
      @click="addFk"
    >
      <template #icon>
        <IconCirclePlus />
      </template>
      <span>添加外键</span>
    </el-button>
    <el-button
      text
      link
      @click="deleteFk"
    >
      <template #icon>
        <IconDelete />
      </template>
      <span>删除外键</span>
    </el-button>
  </div>
</template>

<style scoped lang="scss"></style>
