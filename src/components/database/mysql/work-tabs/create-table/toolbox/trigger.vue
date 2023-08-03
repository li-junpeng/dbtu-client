<!--
 * 触发器
 *
 * @author Junpeng.Li
 * @date 2023-07-29 22:
-->
<script setup lang="ts">
import TableTrigger from '../tabs/table-trigger.vue'

defineOptions({
  name: 'MySQLCreateTableTriggerToolboxComponent'
})

const props = defineProps<{
  tabPaneRef?: InstanceType<typeof TableTrigger>
}>()

const addTrigger = () => {
  props.tabPaneRef?.addRow()
}

const appendTrigger = () => {
  props.tabPaneRef?.appendRow()
}

const deleteTrigger = () => {
  props.tabPaneRef?.deleteRow()
}

const moveTop = () => {
  props.tabPaneRef?.moveTopRow()
}

const moveBottom = () => {
  props.tabPaneRef?.moveBottomRow()
}
</script>

<template>
  <div class="toolbox-item">
    <el-button
      text
      link
      @click="addTrigger"
    >
      <template #icon>
        <IconCirclePlus />
      </template>
      <span>添加触发器</span>
    </el-button>
    <el-button
      text
      link
      @click="appendTrigger"
    >
      <template #icon>
        <IconBottomLeft />
      </template>
      <span>插入触发器</span>
    </el-button>
    <el-button
      text
      link
      @click="deleteTrigger"
    >
      <template #icon>
        <IconDelete />
      </template>
      <span>删除触发器</span>
    </el-button>
    <div class="item-divided"></div>
    <el-button
      text
      link
      @click="moveTop"
    >
      <template #icon>
        <IconTop />
      </template>
      <span>上移</span>
    </el-button>
    <el-button
      text
      link
      @click="moveBottom"
    >
      <template #icon>
        <IconBottom />
      </template>
      <span>下移</span>
    </el-button>
  </div>
</template>

<style scoped lang="scss"></style>
