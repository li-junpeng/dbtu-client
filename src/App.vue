<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { useSystemSettingStore } from '@/stores/SystemSettingStore'
import DynamicDialog from '@/components/ui/dynamic-dialog/index.vue'
import 'dayjs/locale/zh-cn'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 页面加载时，更新主题
const systemSettingStore = useSystemSettingStore()
onMounted(() => {
  systemSettingStore.updateTheme()
})

// 根据系统主题模式自动更改app主题模式
const isDark = useDark()
watch(
  () => isDark,
  () => {
    const { mode } = systemSettingStore.getSetting().theme
    if (mode === 'auto') {
      systemSettingStore.updateThemeMode()
    }
  },
  { deep: true }
)
</script>

<template>
  <el-config-provider :locale="zhCn">
    <RouterView />
    <dynamic-dialog />
  </el-config-provider>
</template>

<style scoped></style>
