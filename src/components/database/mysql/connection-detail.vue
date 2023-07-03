<!--
 * mysql 数据库连接详细信息
 *
 * @author Junpeng.Li
 * @date 2023-07-01 21:
-->
<script setup lang="ts">
import { ElIcon } from 'element-plus'
import type { PropType } from 'vue'
import CommonHeader from '../connection-detail-header.vue'
import IconSvg from './icon.vue'

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
  <common-header :connection-info="connectionInfo">
    <template #icon>
      <el-icon color="#ebebeb" size="30">
        <IconSvg/>
      </el-icon>
    </template>
  </common-header>

  <h1>{{ connectionInfo.dbType }}</h1>
</template>

<style scoped lang="scss">

</style>
