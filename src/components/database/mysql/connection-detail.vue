<!--
 * mysql 数据库连接详细信息
 *
 * @author Junpeng.Li
 * @date 2023-07-01 21:
-->
<script setup lang="ts">
import type { PropType } from 'vue'

defineOptions({
  name: 'MySQLConnectionDetailComponent'
})

const props = defineProps({

  connectionInfo: {
    type: Object as PropType<ConnectionInfo>,
    required: true
  }

})

</script>

<template>
  <h1>{{ connectionInfo.dbType }}</h1>
</template>

<style scoped lang="scss">

</style>
