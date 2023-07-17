<!--
 * 树节点的图标
 *
 * @author Junpeng.Li
 * @date 2023-07-17 15-13
-->
<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted, ref, shallowRef, watch } from 'vue'
import { ElIcon } from 'element-plus'
import { Folder as IconFolder, Loading as IconLoading } from '@element-plus/icons-vue'
import type { ConnectionType } from '@/stores/ConnectionStore'
import { DatabaseIcons } from '@/components/database/db-icons'
import IconDatabase from '@/icons/svg/database.vue'

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
  const type = props.nodeData?.nodeType
  switch (type) {
    case 'group':
      iconCom.value = IconFolder
      break
    case 'connection':
      const dbType = (props.nodeData as ConnectionInfo<BaseConnectionDetail>)?.dbType
      iconCom.value = DatabaseIcons[dbType]
      break
    case 'database':
      iconCom.value = IconDatabase
      break
  }

  isLoading.value = false
}

const setLoading = (b: boolean) => {
  isLoading.value = b
  if (b) {
    iconCom.value = IconLoading
  } else {
    loadCom()
  }
}

watch(() => props.nodeData, data => {
  if (data?.nodeType === 'connection') {
    const status = (data as ConnectionInfo<BaseConnectionDetail>).status
    setLoading(status === 'connecting')
  }
}, {deep: true})

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
