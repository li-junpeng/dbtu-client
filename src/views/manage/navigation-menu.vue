<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

defineOptions({
  name: 'NavigationMenu'
})

const route = useRoute()
console.log(route)
</script>

<template>
  <div class="navigation-menu">
    <div class="menu-box">
      <router-link to="/connection" class="menu-item">连接管理</router-link>
      <router-link to="/team" class="menu-item is-active">团队管理</router-link>
      <a class="menu-item">操作日志</a>
      <a class="menu-item">回收站</a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navigation-menu {
  width: 200px;
  height: 100%;
  border-right: 1px solid var(--dbtu-border-color);

  .menu-box {
    color: var(--dbtu-font-color);
    line-height: 34px;
    padding: 5px 10px;
    display: flex;
    flex-direction: column;

    .menu-item {
      padding: 0 10px;
      cursor: pointer;
      margin-bottom: 5px;
      border-radius: var(--dbtu-border-radius);

      &.is-active,
      &:hover {
        background-color: var(--dbtu-hover-color);
      }
    }
  }
}
</style>
