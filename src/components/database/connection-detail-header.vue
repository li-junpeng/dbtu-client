<!--
 * 数据库连接详情通用头部
 *
 * @author Junpeng.Li
 * @date 2023-07-03 11-25
-->
<script setup lang="ts">
import { computed, defineSlots, PropType } from 'vue'
import { ConnectionStatus } from '@/common/constants/ConnectionConstant'

defineOptions({
  name: 'ConnectionDetailCommonHeaderComponent'
})

defineSlots<{
  icon(): any
}>()

const props = defineProps({

  connectionInfo: {
    type: Object as PropType<ConnectionInfo>,
    required: true
  }

})

const statusText = computed(() => {
  return ConnectionStatus[props.connectionInfo?.status] || ConnectionStatus.no_connection
})

</script>

<template>
  <div class="detail-header-wrapper">
    <div :class="`db-icon ${connectionInfo.status}`">
      <slot name="icon"/>
    </div>
    <div class="info-box">
      <p class="dbtu-text-ellipsis  connection-name">{{ connectionInfo.name }}</p>
      <p class="connection-status-text">{{ statusText }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
$icon-box-size: 50px;

.detail-header-wrapper {
  display: flex;
  gap: 10px;

  .db-icon {
    width: $icon-box-size;
    height: $icon-box-size;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: calc(var(--dbtu-border-radius) + 2px);
    flex-shrink: 0;

    &.no_connection,
    &.connecting {
      background-color: #a8a8a8;
    }

    &.connected {
      background-color: #13c51d;
    }
  }

  .info-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    flex: 1;
    width: 0;

    .connection-name {
      font-weight: 500;
      color: var(--dbtu-font-color);
    }

    .connection-status-text {
      color: var(--dbtu-font-color-minor);
    }
  }
}
</style>
