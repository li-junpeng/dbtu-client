<!--
 * 系统设置对话框
 *
 * @author Junpeng.Li
 * @date 2023-06-27 15-29
-->
<script setup lang="ts">
import { navTabs, useSystemSettingStore } from '@/stores/SystemSettingStore'

defineOptions({
  name: 'SystemSettingDialog'
})

const systemSettingStore = useSystemSettingStore()

// region 左侧tab
/**
 * 切换tab, 加载对应的设置页面
 *
 * @param tab 切换后的tab
 */
const onChangeTab = (tab: SystemSettingTabItem) => {
  systemSettingStore.activeTab = tab
}
// endregion 左侧tab

// region 动态加载组件
const pageModules = import.meta.glob('./*.vue')
const contentComponent = shallowRef()
const loadComponent = () => {
  const path = systemSettingStore.activeTab?.component
  const component = pageModules[path as string]
  component().then(() => {
    // @ts-ignore
    contentComponent.value = defineAsyncComponent(component)
  })
}
watch(
  () => systemSettingStore.activeTab,
  () => {
    loadComponent()
  },
  { deep: true }
)
// endregion 动态加载组件
</script>

<template>
  <el-dialog
    v-model="systemSettingStore.visible"
    class="el-dialog__header-no-padding el-dialog__body-no-padding"
    width="900px"
    draggable
    :close-on-click-modal="false"
  >
    <template #header>
      <span class="dialog-header">设置</span>
    </template>
    <div class="setting-content">
      <!-- 左侧导航tab -->
      <div class="dbtu-un-user-select nav-tab-box">
        <ul class="nav-tab">
          <li
            v-for="tab in navTabs"
            :key="tab.key"
            class="nav-tab__item"
            :class="{
              'is-active': systemSettingStore.activeTab?.key === tab.key
            }"
            @click="onChangeTab(tab)"
          >
            <el-icon :size="tab.iconSize || 'inherit'">
              <component :is="tab.icon" />
            </el-icon>
            <span>{{ tab.title }}</span>
          </li>
        </ul>

        <div class="reset-setting">
          <el-icon>
            <DIconReset />
          </el-icon>
          <span>恢复默认值</span>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="setting-page">
        <component :is="contentComponent" />
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
