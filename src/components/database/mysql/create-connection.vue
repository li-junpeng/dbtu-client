<!--
 * 创建MySQL连接
 *
 * @author Junpeng.Li
 * @date 2023-07-03 23:
-->
<script setup lang="ts">
import { onMounted } from 'vue'
import { NumberUtils } from '@/common/utils/NumberUtils'

defineOptions({
  name: 'CreateMySQLConnectionForm'
})

const props = defineProps<{
  formData: ConnectionInfo<MySQLConnectionInfo>
}>()

const initFormData = () => {
  if (NumberUtils.isEmpty(props.formData.port)) {
    props.formData.port = 3306
  }
  if (!props.formData.detail) {
    props.formData.detail = {
      username: 'root'
    }
  }
}

onMounted(() => {
  initFormData()
})
</script>

<template>
  <h1>我是mysql</h1>
</template>

<style scoped lang="scss">

</style>
