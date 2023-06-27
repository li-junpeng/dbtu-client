<!--
 * 系统设置对话框
 *
 * @author Junpeng.Li
 * @date 2023-06-27 15-29
-->
<script setup lang="ts">
import { ref } from 'vue'
import { ElDialog, ElIcon } from 'element-plus'
// svg icons
import IconTheme from '@/icons/svg/theme.vue'
import IconProxy from '@/icons/svg/proxy.vue'
import IconKeymap from '@/icons/svg/keymap.vue'
import IconReset from '@/icons/svg/reset.vue'
import IconSecurity from '@/icons/svg/security.vue'

defineOptions({
  name: 'SystemSettingDialog'
})

const visible = ref(false)

const activeTab = ref<SystemSettingTabKey>('theme')
const navTabs = [
  {
    key: 'theme',
    title: '主题',
    icon: IconTheme
  },
  {
    key: 'proxy',
    title: '代理服务器',
    icon: IconProxy
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
  activeTab.value = tab.key
}

/**
 * 打开对话框
 *
 * @param tab 打开对话框时默认选中的tab
 */
const onOpen = (tab?: SystemSettingTabKey) => {
  if (tab) {
    activeTab.value = tab
  }

  visible.value = true
}

defineExpose({
  onOpen
})
</script>

<template>
  <el-dialog
    v-model="visible"
    title="设置"
    width="900px"
    draggable
    :close-on-click-modal="false"
  >
    <div class="setting-content">
      <!-- 左侧导航tab -->
      <div class="dbtu-un-user-select nav-tab-box">
        <ul class="nav-tab">
          <li
            v-for="tab in navTabs"
            :key="tab.key"
            class="nav-tab__item"
            :class="{
            'is-active': activeTab === tab.key
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

      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
@use "./index.scss";
</style>
