<!--
 * 左侧导航组件
 *
 * @author Junpeng.Li
 * @date 2023-06-27 11:16
-->
<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useSystemSettingStore } from '@/stores/SystemSettingStore'

defineOptions({
  name: 'NavigationMenu'
})

defineProps({
  // 是否显示标签
  showLabel: {
    type: Boolean,
    default: false
  }
})

// 获取路由定义
const router = useRouter()
const menus = router.getRoutes().find(route => route.path === '/manage')?.children

// 监听路由变化, 动态修改菜单激活项
const currentRoutePath = ref<string>('')
const route = useRoute()
watch(
  () => route,
  newRoute => {
    currentRoutePath.value = newRoute.path
  },
  { deep: true }
)

// 系统设置对话框实例
const systemSettingStore = useSystemSettingStore()
const themeData = systemSettingStore.getSetting().theme
const openSystemSettingDialog = () => {
  systemSettingStore.open()
}

onMounted(() => {
  currentRoutePath.value = route.path
})
</script>

<template>
  <div
    class="navigation-menu"
    :style="{
      width: `${showLabel ? '200px' : '40px'}`
    }"
  >
    <!-- 导航菜单 -->
    <div class="menu-box">
      <el-tooltip
        v-for="menu in menus"
        :key="menu.name"
        :content="(menu.meta?.['title'] || '无法识别的菜单') as string"
        placement="right"
        effect="dark"
        :enterable="false"
        :disabled="showLabel"
        :show-after="600"
      >
        <router-link
          :to="menu.path"
          class="dbtu-un-user-select menu-item"
          :class="{
            'hide-label': !showLabel,
            'is-active': currentRoutePath === menu.path
          }"
        >
          <el-icon :size="showLabel ? 16 : 18">
            <component :is="menu.meta?.['icon']" />
          </el-icon>
          <span v-if="showLabel">{{ menu.meta?.['title'] }}</span>
        </router-link>
      </el-tooltip>
    </div>

    <!-- 功能按钮 -->
    <div
      v-if="themeData.layout === 'no-header'"
      class="menu-btn-box"
    >
      <el-tooltip
        content="GitHub，点个Star"
        placement="right"
        effect="dark"
      >
        <a
          href="https://github.com/li-junpeng/dbtu-client"
          target="_blank"
        >
          <el-icon
            :size="16"
            class="menu-btn__item"
          >
            <DIconAppGithub />
          </el-icon>
        </a>
      </el-tooltip>

      <el-tooltip
        content="消息"
        placement="right"
        effect="dark"
      >
        <el-icon
          :size="18"
          class="menu-btn__item"
        >
          <DIconNotify />
        </el-icon>
      </el-tooltip>

      <el-tooltip
        content="用户"
        placement="right"
        effect="dark"
      >
        <el-icon
          :size="18"
          class="menu-btn__item"
        >
          <IconUser />
        </el-icon>
      </el-tooltip>

      <el-tooltip
        content="设置"
        placement="right"
        effect="dark"
      >
        <el-icon
          :size="18"
          class="menu-btn__item"
          @click="openSystemSettingDialog"
        >
          <DIconSetting />
        </el-icon>
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navigation-menu {
  width: 200px;
  height: 100%;
  border-right: 1px solid var(--dbtu-divide-borer-color);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .menu-box {
    color: var(--dbtu-font-color);
    line-height: 34px;
    padding: 3px;
    display: flex;
    flex-direction: column;

    .menu-item {
      padding: 0 10px;
      cursor: pointer;
      margin-bottom: 10px;
      border-radius: var(--dbtu-border-radius);
      display: flex;
      align-items: center;
      gap: 8px;

      &.hide-label {
        height: 33px;
        border-radius: var(--dbtu-border-radius);
        justify-content: center;
      }

      &.is-active {
        color: var(--el-color-white);
        transition: all var(--dbtu-transition-duration);
        background-color: var(--dbtu-theme-color);
      }

      &:not(.is-active):hover {
        color: var(--dbtu-font-color-light);
        background-color: var(--dbtu-hover-color);
      }
    }
  }

  .menu-btn-box {
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;

    .menu-btn__item {
      padding: 15px 0;
      cursor: pointer;
      color: var(--dbtu-font-color);
    }
  }
}
</style>
