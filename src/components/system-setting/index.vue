<!--
 * 系统设置对话框
 *
 * @author Junpeng.Li
 * @date 2023-06-27 15-29
-->
<script setup lang="ts">
import { defineAsyncComponent, ref, shallowRef, watch } from 'vue'
import { ElDialog, ElIcon } from 'element-plus'
// region svg icons
import IconTheme from '@/icons/svg/theme.vue'
import IconProxy from '@/icons/svg/proxy.vue'
import IconKeymap from '@/icons/svg/keymap.vue'
import IconReset from '@/icons/svg/reset.vue'
import IconSecurity from '@/icons/svg/security.vue'
// endregion svg icons
import { StringUtils } from '@/common/utils/StringUtils'

defineOptions({
  name: 'SystemSettingDialog'
})

const visible = ref(false)

// region 左侧tab
const activeTab = ref<SystemSettingTabItem | null>(null)
const navTabs = [
  {
    key: 'theme',
    title: '主题',
    icon: IconTheme,
    component: './setting-theme.vue'
  },
  {
    key: 'proxy',
    title: '代理服务器',
    icon: IconProxy,
    component: './setting-proxy-server.vue'
  },
  {
    key: 'keymap',
    title: '快捷键',
    icon: IconKeymap
  },
  {
    key: 'security',
    title: '隐私与安全',
    icon: IconSecurity,
    iconSize: 16
  }
] as SystemSettingTabItem[]
/**
 * 切换tab, 加载对应的设置页面
 *
 * @param tab 切换后的tab
 */
const onChangeTab = (tab: SystemSettingTabItem) => {
  activeTab.value = tab
}
// endregion 左侧tab

// region 动态加载组件
const pageModules = import.meta.glob('./*.vue')
const contentComponent = shallowRef()
const loadComponent = () => {
  const path = activeTab.value?.component
  pageModules[path]().then(() => {
    contentComponent.value = defineAsyncComponent(pageModules[path])
  })
}
watch(() => activeTab, () => {
  loadComponent()
}, {deep: true})
// endregion 动态加载组件

/**
 * 打开对话框
 *
 * @param tabKey 打开对话框时默认选中的tab的key
 */
const onOpen = (tabKey?: SystemSettingTabKey) => {
  let tabItem = StringUtils.isNotEmpty(tabKey as string)
    ? navTabs.find(tab => tab.key === tabKey)
    : navTabs[0]
  if (!tabItem) {
    tabItem = navTabs[0]
  }
  activeTab.value = tabItem
  visible.value = true
}

defineExpose({
  onOpen
})
</script>

<template>
  <el-dialog
    v-model="visible"
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
            'is-active': activeTab?.key === tab.key
          }"
            @click="onChangeTab(tab)"
          >
            <el-icon :size="tab.iconSize || 'inherit'">
              <component :is="tab.icon"/>
            </el-icon>
            <span>{{ tab.title }}</span>
          </li>
        </ul>

        <div class="reset-setting">
          <el-icon>
            <IconReset/>
          </el-icon>
          <span>恢复默认值</span>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="setting-page">
        <component :is="contentComponent"/>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
@use "./index.scss";
</style>
