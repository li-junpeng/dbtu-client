<script setup lang="ts">
import { RouterView } from 'vue-router'

import PageHeader from './header.vue'
import NavigationMenu from './navigation-menu.vue'

import { useSystemSettingStore } from '@/stores/SystemSettingStore'
import { onMounted } from 'vue'

defineOptions({
  name: 'ManagePage'
})

const systemSettingStore = useSystemSettingStore()
onMounted(() => {
  systemSettingStore.updateTheme()
})
</script>

<template>
  <!-- 页面头部 -->
  <page-header/>

  <!-- 页面内容 -->
  <div class="page-content">
    <!-- 导航菜单 -->
    <navigation-menu/>
    <!-- 二级路由, 显示具体业务模块页面 -->
    <div class="content-box">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;

  .page-content {
    flex: 1;
    display: flex;

    .content-box {
      flex: 1;
    }
  }
}
</style>
