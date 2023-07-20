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
import IconTable from '@/icons/svg/table.vue'
import IconView from '@/icons/svg/view.vue'
import IconFunction from '@/icons/svg/function.vue'
import IconSearchSql from '@/icons/svg/search-sql.vue'
import IconBackup from '@/icons/svg/backup.vue'

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
    case 'table':
    case 'table_instance':
      iconCom.value = IconTable
      break
    case 'view':
    case 'view_instance':
      iconCom.value = IconView
      break
    case 'function':
    case 'function_instance':
      iconCom.value = IconFunction
      break
    case 'search':
    case 'search_instance':
      iconCom.value = IconSearchSql
      break
    case 'backup':
      iconCom.value = IconBackup
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
  switch (data?.nodeType) {
    case 'connection':
      setLoading((data as ConnectionInfo<BaseConnectionDetail>).status === 'connecting')
      break
    case 'database':
      setLoading((data as DatabaseNode).status === 'loading')
      break
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
