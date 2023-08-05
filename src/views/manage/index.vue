<script setup lang="ts">
import PageHeader from './header.vue'
import NavigationMenu from './navigation-menu.vue'
import { useSystemSettingStore } from '@/stores/SystemSettingStore'
// 组件
import SystemSettingDialog from '@/components/system-setting/index.vue'

defineOptions({
  name: 'ManagePage'
})

const themeData = useSystemSettingStore().getSetting().theme
const containerStyle = computed(() => {
  return {
    height: themeData.layout === 'normal' ? 'calc(100% - 40px)' : '100%'
  }
})
</script>

<template>
  <el-container style="height: 100%">
    <!-- 页面头部 -->
    <el-header
      v-if="themeData.layout === 'normal'"
      style="--el-header-padding: 0; --el-header-height: auto"
    >
      <page-header />
    </el-header>
    <el-container :style="containerStyle">
      <!-- 导航菜单 -->
      <el-aside width="40">
        <navigation-menu class="nav-menu" />
      </el-aside>
      <!-- 二级路由, 显示具体业务模块页面 -->
      <el-container style="--el-main-padding: 0; height: 100%">
        <router-view />
      </el-container>
    </el-container>
  </el-container>

  <system-setting-dialog ref="systemSettingDialogRef" />
</template>

<style lang="scss"></style>
