<script setup lang="ts">
import { provide } from 'vue'
import ConnectionList from './components/connection-list.vue'
import CreateConnection from './create-connection.vue'
import CreateGroup from './create-group.vue'
import { useComponentRef } from '@/components/element-plus/elemenet-plus-util'
import { InjectionKey } from '@/common/constants/ConnectionConstant'

defineOptions({
  name: 'ConnectionPage'
})

const createConnectionRef = useComponentRef(CreateConnection)
const createGroupRef = useComponentRef(CreateGroup)

const openCreateConnection = (data?: ConnectionInfo<BaseConnectionDetail>, db: DatabaseIdent = 'mysql') => {
  createConnectionRef.value?.open(data, db)
}

const openCreateGroup = (data?: ConnectionGroup) => {
  createGroupRef.value?.open(data)
}

provide(InjectionKey.openCreateConnection, openCreateConnection)
provide(InjectionKey.openCreateGroup, openCreateGroup)
</script>

<template>
  <div class="connection-container">
    <div class="connection-list">
      <connection-list/>
    </div>
  </div>

  <create-connection
    ref="createConnectionRef"
  />

  <create-group
    ref="createGroupRef"
  />
</template>

<style scoped lang="scss">
.connection-container {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .connection-list {
    width: 300px;
    height: 100%;
    overflow: auto;
    border-right: 1px solid var(--dbtu-divide-borer-color);
    flex-shrink: 0;
  }
}
</style>
