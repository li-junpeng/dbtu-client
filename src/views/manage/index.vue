<script setup lang="ts">
import PageHeader from './header.vue'
import NavigationMenu from './navigation-menu.vue'

defineOptions({
  name: 'ManagePage'
})
</script>

<template>
  <el-container style="height: 100%">
    <!-- 页面头部 -->
    <el-header style="--el-header-padding: 0; --el-header-height: auto;">
      <page-header/>
    </el-header>
    <el-container style="height: calc(100% - 40px)">
      <!-- 导航菜单 -->
      <el-aside width="40">
        <navigation-menu class="nav-menu"/>
      </el-aside>
      <!-- 二级路由, 显示具体业务模块页面 -->
      <el-container style="--el-main-padding: 0;height: 100%">
        <router-view/>
      </el-container>
    </el-container>
  </el-container>
</template>

<style lang="scss">

</style>
