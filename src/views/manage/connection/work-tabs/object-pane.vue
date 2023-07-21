<!--
 * 对象选项卡面板
 *
 * @author Junpeng.Li
 * @date 2023-07-21 10-59
-->
<script setup lang="ts">
import { useWorkTabStore } from '@/stores/WorkTabStore'

defineOptions({
  name: 'WorkTabObjectPaneComponent'
})

const workTabStore = useWorkTabStore()
</script>

<template>
  <component
    :is="workTabStore.objectPaneComponent"
    :data="workTabStore.objectPaneProps"
  />
</template>
