<!--
 * 字段的工具栏
 *
 * @author Junpeng.Li
 * @date 2023-07-29 22:21
-->
<script setup lang="ts">
import FieldTabPane from '../tabs/field.vue'

defineOptions({
  name: 'MySQLCreateTableFieldToolboxComponent'
})

const props = defineProps<{
  tabPaneRef?: InstanceType<typeof FieldTabPane>
}>()
const tabPaneRef = toRef(props, 'tabPaneRef')
const addField = () => {
  tabPaneRef.value?.addField()
}

const deleteField = () => {
  tabPaneRef.value?.deleteField()
}

const appendField = () => {
  tabPaneRef.value?.appendField()
}

const moveUpField = () => {
  tabPaneRef.value?.moveUpField()
}

const moveDownField = () => {
  tabPaneRef.value?.moveDownField()
}
</script>

<template>
  <div class="toolbox-item">
    <el-button
      text
      link
      @click="addField"
    >
      <template #icon>
        <IconCirclePlus />
      </template>
      <span>添加字段</span>
    </el-button>
    <el-button
      text
      link
      @click="appendField"
    >
      <template #icon>
        <IconTopLeft />
      </template>
      <span>插入字段</span>
    </el-button>
    <el-button
      text
      link
      @click="deleteField"
    >
      <template #icon>
        <IconDelete />
      </template>
      <span>删除字段</span>
    </el-button>
    <div class="item-divided"></div>
    <el-button
      text
      link
      @click="tabPaneRef?.triggerPrimaryKey()"
    >
      <template #icon>
        <IconKey />
      </template>
      <span>主键</span>
    </el-button>
    <div class="item-divided"></div>
    <el-button
      text
      link
      @click="moveUpField"
    >
      <template #icon>
        <IconTop />
      </template>
      <span>上移</span>
    </el-button>
    <el-button
      text
      link
      @click="moveDownField"
    >
      <template #icon>
        <IconBottom />
      </template>
      <span>下移</span>
    </el-button>
  </div>
</template>

<style scoped lang="scss"></style>
