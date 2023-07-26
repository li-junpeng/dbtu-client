<!--
 * 表数据
 *
 * @author Junpeng.Li
 * @date 2023-07-26 16-53
-->
<script setup lang="ts">
import type { PropType } from 'vue'

defineExpose({
  name: 'MySQLWorkTabTableDataComponent'
})

defineProps({
  data: {
    type: Object as PropType<MySqlTableNode>
  }
})



</script>

<template>
  <h1>我是数据表啊啊 {{ data }}</h1>
</template>

<style scoped lang="scss">

</style>
