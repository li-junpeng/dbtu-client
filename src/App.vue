<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useDark } from '@vueuse/core'
import { useSystemSettingStore } from '@/stores/SystemSettingStore'
import DynamicDialog from '@/components/ui/dynamic-dialog/index.vue'

// 页面加载时，更新主题
const systemSettingStore = useSystemSettingStore()
onMounted(() => {
  systemSettingStore.updateTheme()
})

// 根据系统主题模式自动更改app主题模式
const isDark = useDark()
watch(() => isDark, () => {
  const { mode } = systemSettingStore.getSetting().theme
  if (mode === 'auto') {
    systemSettingStore.updateThemeMode()
  }
}, { deep: true })
</script>

<template>
  <RouterView/>
  <dynamic-dialog/>
</template>

<style scoped>

</style>
