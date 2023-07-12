<!--
 * 状态组件
 *
 * @author Junpeng.Li
 * @date 2023-07-12 16-51
-->
<script setup lang="ts">
import { ElIcon } from 'element-plus'
import { Loading as IconLoading } from '@element-plus/icons-vue'
import { ConnectionStatus } from '@/common/constants/ConnectionConstant'

defineOptions({
  name: 'ConnectionStatusComponent'
})

interface PropDefine {
  // 图标大小
  size?: number
  // 状态
  status: ConnectionStatusType
}

const props = withDefaults(defineProps<PropDefine>(), {
  size: 12,
  status: 'no_connection'
})
</script>

<template>
  <span
    class="dbtu-status-box"
    :class="[status]"
    :style="{
      '--status-icon-size': `${props.size}px`
    }"
  >
    <span v-if="status !== 'connecting'" class="status-dot"></span>
    <el-icon v-else class="is-loading">
      <IconLoading/>
    </el-icon>
    <span>{{ ConnectionStatus[status] }}</span>
  </span>
</template>

<style scoped lang="scss">
.dbtu-status-box {
  display: inline-flex;
  gap: var(--dbtu-icon-text-gap);
  align-items: center;
  line-height: 18px;

  .status-dot {
    width: var(--status-icon-size, 16px);
    height: var(--status-icon-size, 16px);
    border-radius: 50%;
    background-image: linear-gradient(to left, #9f9f9f 0%, #b6b6b6 100%);
  }

  &.connected .status-dot {
    background-image: linear-gradient(to left, #13c51d 0%, #2be735 100%);
  }
}
</style>
