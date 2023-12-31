<script setup lang="ts">
import type { CSSProperties } from 'vue'
import ConnectionList from './components/connection-list.vue'
import CreateConnection from './create-connection.vue'
import CreateGroup from './create-group.vue'
import WorkTabs from './work-tabs/index.vue'
import { useComponentRef } from '@/components/element-plus/element-plus-util'
import { InjectionKey } from '@/common/constants/ConnectionConstant'
import { useSystemSettingStore } from '@/stores/SystemSettingStore'
import vResizer from '@/components/ui/vue-directives/dom-resizer'

defineOptions({
  name: 'ConnectionPage'
})

const createConnectionRef = useComponentRef(CreateConnection)
const createGroupRef = useComponentRef(CreateGroup)
const connectionListRef = useComponentRef(ConnectionList)

const openCreateConnection = (data?: ConnectionInfo<BaseConnectionDetail>, db: DatabaseIdent = 'mysql', groupId?: number) => {
  createConnectionRef.value?.open(data, db, groupId)
}

const openCreateGroup = (data?: ConnectionGroup) => {
  createGroupRef.value?.open(data)
}

const loadConnection = () => {
  connectionListRef.value?.loadConnections()
}

provide(InjectionKey.openCreateConnection, openCreateConnection)
provide(InjectionKey.openCreateGroup, openCreateGroup)

const systemSettingStore = useSystemSettingStore()
const connectionListStyle = computed(() => {
  return {
    position: 'relative',
    width: systemSettingStore.connectionListSize.width,
    height: systemSettingStore.connectionListSize.height
  } as CSSProperties
})
</script>

<template>
  <div class="connection-container">
    <div
      ref="connectionListRef"
      class="connection-list"
      v-resizer="{
        position: 'right',
        minWidth: 300,
        maxWidth: 800,
        onChange: (width) => {
          systemSettingStore.connectionListSize.width = width
        }
      }"
      :style="connectionListStyle"
    >
      <connection-list ref="connectionListRef" />
    </div>

    <work-tabs class="connection-content" />
  </div>

  <create-connection
    ref="createConnectionRef"
    @submit-success="loadConnection"
  />

  <create-group
    ref="createGroupRef"
    @submit-success="loadConnection"
  />
</template>

<style scoped lang="scss">
.connection-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;

  .connection-list {
    overflow: auto;
    border-right: 1px solid var(--dbtu-divide-borer-color);
    flex-shrink: 0;
  }

  .connection-content {
    flex: 1;
  }
}
</style>
