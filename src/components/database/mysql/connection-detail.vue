<!--
 * mysql 数据库连接详细信息
 *
 * @author Junpeng.Li
 * @date 2023-07-01 21:
-->
<script setup lang="ts">
import { StringUtils } from '@/common/utils/StringUtils'
import CommonHeader from '@/components/database/component/connection-detail/common-header.vue'
import IconSvg from './icon.vue'

defineOptions({
  name: 'MySQLConnectionDetailComponent'
})

defineProps({
  connectionInfo: {
    type: Object as PropType<ConnectionInfo<MySQLConnectionInfo>>,
    required: true
  }
})
</script>

<template>
  <el-scrollbar ref="scrollbarRef">
    <common-header :connection-info="connectionInfo">
      <template #icon>
        <el-icon
          color="#ebebeb"
          size="30"
        >
          <IconSvg />
        </el-icon>
      </template>
    </common-header>

    <ul class="detail-items">
      <li>
        <div>服务器版本</div>
        <div>{{ connectionInfo.detail.version || StringUtils.NULL_SHOW_VALUE }}</div>
      </li>
      <li>
        <div>会话</div>
        <div>{{ connectionInfo.detail.sessionNum || 0 }}</div>
      </li>
      <li>
        <div>主机</div>
        <div>{{ connectionInfo.host || StringUtils.NULL_SHOW_VALUE }}</div>
      </li>
      <li>
        <div>端口</div>
        <div>{{ connectionInfo.port || StringUtils.NULL_SHOW_VALUE }}</div>
      </li>
      <li>
        <div>用户名</div>
        <div>{{ connectionInfo.detail.username || StringUtils.NULL_SHOW_VALUE }}</div>
      </li>
    </ul>
  </el-scrollbar>
</template>

<style scoped lang="scss">
@use '@/components/database/component/connection-detail/index.scss';
</style>
