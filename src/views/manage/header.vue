<script lang="ts" setup>
defineOptions({
  name: 'PageHeader'
})
</script>

<template>
  <div class="page-header">
    我是页面头部哈
  </div>
</template>

<style lang="scss">
.page-header {
  width: 100%;
  height: 60px;
  border-bottom: 1px solid var(--dbtu-border-color);
  color: var(--dbtu-font-color);
  display: flex;
  align-items: center;
  padding: 10px;
}
</style>
