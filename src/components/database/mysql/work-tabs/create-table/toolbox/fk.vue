<!--
 * 外键
 *
 * @author Junpeng.Li
 * @date 2023-07-29 22:
-->
<script setup lang="ts">
defineOptions({
  name: 'MySQLCreateTableFkToolboxComponent'
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
      <span>添加外键</span>
    </el-button>
    <el-button
      text
      link
      disabled
    >
      <template #icon>
        <IconDelete/>
      </template>
      <span>删除外键</span>
    </el-button>
  </div>
</template>

<style scoped lang="scss">

</style>
