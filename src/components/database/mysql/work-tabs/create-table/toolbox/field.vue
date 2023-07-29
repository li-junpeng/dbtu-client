<!--
 * 字段的工具栏
 *
 * @author Junpeng.Li
 * @date 2023-07-29 22:
-->
<script setup lang="ts">
defineOptions({
  name: 'MySQLCreateTableFieldToolboxComponent'
})
</script>

<template>
  <div class="toolbox-item">
    <el-button
      text
      link
      disabled
    >
      <template #icon>
        <IconCirclePlus/>
      </template>
      <span>添加字段</span>
    </el-button>
    <el-button
      text
      link
      disabled
    >
      <template #icon>
        <IconBottomLeft/>
      </template>
      <span>插入字段</span>
    </el-button>
    <el-button
      text
      link
      disabled
    >
      <template #icon>
        <IconDelete/>
      </template>
      <span>删除字段</span>
    </el-button>
    <div class="item-divided"></div>
    <el-button
      text
      link
      disabled
    >
      <template #icon>
        <IconKey/>
      </template>
      <span>主键</span>
    </el-button>
    <div class="item-divided"></div>
    <el-button
      text
      link
      disabled
    >
      <template #icon>
        <IconTop/>
      </template>
      <span>上移</span>
    </el-button>
    <el-button
      text
      link
      disabled
    >
      <template #icon>
        <IconBottom/>
      </template>
      <span>下移</span>
    </el-button>
  </div>
</template>

<style scoped lang="scss">

</style>
