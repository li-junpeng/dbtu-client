<script setup lang="ts">
import { watch } from 'vue'
import { useDark } from '@vueuse/core'
import { useSystemSettingStore } from '@/stores/SystemSettingStore'

// 根据系统主题模式自动更改app主题模式
const systemSettingStore = useSystemSettingStore()
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
</template>

<style scoped>

</style>
