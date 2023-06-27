<!--
 * 左侧导航组件
 *
 * @author Junpeng.Li
 * @date 2023-06-27 11:16
-->
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ElIcon } from 'element-plus'

defineOptions({
  name: 'NavigationMenu'
})

// 获取路由定义
const router = useRouter()
const menus = router.getRoutes().find(route => route.path === '/')?.children

// 监听路由变化, 动态修改菜单激活项
const currentRoutePath = ref<string>('')
const route = useRoute()
watch(() => route, (newRoute) => {
  currentRoutePath.value = newRoute.path
}, {deep: true})
onMounted(() => {
  currentRoutePath.value = route.path
})
</script>

<template>
  <div class="navigation-menu">
    <div class="menu-box">
      <router-link
        v-for="menu in menus"
        :key="menu.name"
        :to="menu.path"
        class="menu-item"
        :class="{
          'is-active': currentRoutePath === menu.path
        }"
      >
        <el-icon :size="16">
          <component :is="menu.meta?.['icon']"/>
        </el-icon>
        <span>{{ menu.meta?.['title'] }}</span>
      </router-link>
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
      display: flex;
      align-items: center;
      gap: 8px;

      &.is-active,
      &:hover {
        color: var(--dbtu-font-color-light);
        background-color: var(--dbtu-hover-color);
      }
    }
  }
}
</style>
