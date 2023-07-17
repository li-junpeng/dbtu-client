<!--
 * 树节点的图标
 *
 * @author Junpeng.Li
 * @date 2023-07-17 15-13
-->
<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted, ref, shallowRef } from 'vue'
import { ElIcon } from 'element-plus'
import { Folder as IconFolder, Loading as IconLoading } from '@element-plus/icons-vue'
import type { ConnectionType } from '@/stores/ConnectionStore'
import { DatabaseIcons } from '@/components/database/db-icons'

defineOptions({
  name: 'ConnectionTreeNodeIconComponent'
})

const props = defineProps({
  nodeData: {
    type: Object as PropType<ConnectionType>,
    required: true
  }
})

const isLoading = ref(false)
const iconCom = shallowRef()

const loadCom = () => {
  const type = props.nodeData?.dbType
  switch (type) {
    case 'group':
      iconCom.value = IconFolder
      break
    case 'mysql':
    case 'sql_server_2012':
      iconCom.value = DatabaseIcons[type]
      break
  }

  isLoading.value = false
}

onMounted(() => {
  iconCom.value = IconLoading
  isLoading.value = true

  loadCom()
})
</script>

<template>
  <el-icon
    :class="{
      'is-loading': isLoading
    }"
  >
    <component :is="iconCom"/>
  </el-icon>
</template>
