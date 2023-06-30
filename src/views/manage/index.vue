<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ElAside, ElContainer, ElHeader, ElMain } from 'element-plus'

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
    <el-container>
      <!-- 导航菜单 -->
      <el-aside width="200">
        <navigation-menu class="nav-menu"/>
      </el-aside>
      <!-- 二级路由, 显示具体业务模块页面 -->
      <el-main style="--el-main-padding: 0;">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss">

</style>
