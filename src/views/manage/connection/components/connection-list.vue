<!--
 * 连接列表
 *
 * @author Junpeng.Li
 * @date 2023-07-14 16-35
-->
<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue'
import { ElButton, ElIcon, ElTooltip, ElTreeV2 } from 'element-plus'
import { Folder as IconFolder, FolderAdd as IconFolderAdd, Minus as IconMinus, Plus as IconPlus } from '@element-plus/icons-vue'
import { InjectionKey } from '@/common/constants/ConnectionConstant'
import { useConnectionStore } from '@/stores/ConnectionStore'
import { useComponentRef } from '@/components/element-plus/elemenet-plus-util'

defineOptions({
  name: 'ConnectionListComponent'
})

const openCreateConnection = inject<(data?: ConnectionInfo<BaseConnectionDetail>, db?: DatabaseIdent) => void>(InjectionKey.openCreateConnection)
const openCreateGroup = inject<(name?: string) => void>(InjectionKey.openCreateGroup)

const treeProps = {
  value: 'id',
  label: 'name',
  children: 'children',
}

const treeHeight = ref(400)
const treeRef = useComponentRef(ElTreeV2)
const connectionStore = useConnectionStore()
const connections = connectionStore.findOrderByName()
watch(() => connectionStore.connections, () => {
  treeRef.value?.setData(connectionStore.findOrderByName())
}, {deep: true})

onMounted(() => {
  const $dom = document.querySelector('.box-content')
  treeHeight.value = $dom?.clientHeight || 400
})
</script>

<template>
  <div class="dbtu-un-user-select box-header">
    <span>连接列表</span>
    <div class="btn-list">
      <el-tooltip
        content="创建分组"
        :enterable="false"
      >
        <el-button
          text
          link
          @click="() => openCreateGroup?.()"
        >
          <template #icon>
            <el-icon :size="16">
              <IconFolderAdd/>
            </el-icon>
          </template>
        </el-button>
      </el-tooltip>
      <el-tooltip
        content="创建连接"
        :enterable="false"
      >
        <el-button
          :icon="IconPlus"
          text
          link
          @click="() => openCreateConnection?.()"
        ></el-button>
      </el-tooltip>
      <el-tooltip
        content="最小化"
        :enterable="false"
      >
        <el-button :icon="IconMinus" text link></el-button>
      </el-tooltip>
    </div>
  </div>
  <div class="box-content">
    <el-tree-v2
      ref="treeRef"
      :data="connections"
      :props="treeProps"
      :height="treeHeight"
      :item-size="34"
      empty-text="暂无数据库连接"
    >
      <template #default="{ node, data }">
        <div class="tree-item">
          <el-icon>
            <IconFolder/>
          </el-icon>
          <span>{{ node.label }}</span>
        </div>
      </template>
    </el-tree-v2>
  </div>
</template>

<style scoped lang="scss">
.box-header {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  color: var(--dbtu-font-color);
}

.box-content {
  width: 100%;
  height: calc(100% - 40px);
  overflow: auto;
}

.tree-item {
  display: flex;
  align-items: center;
  line-height: 34px;
  gap: var(--dbtu-icon-text-gap);
}
</style>
