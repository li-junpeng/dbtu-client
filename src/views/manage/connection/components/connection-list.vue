<!--
 * 连接列表
 *
 * @author Junpeng.Li
 * @date 2023-07-14 16-35
-->
<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue'
import { ElButton, ElIcon, ElTooltip, ElTreeV2 } from 'element-plus'
import {
  Folder as IconFolder,
  FolderAdd as IconFolderAdd,
  Minus as IconMinus,
  Plus as IconPlus,
  MoreFilled as IconMoreFilled
} from '@element-plus/icons-vue'
import { InjectionKey } from '@/common/constants/ConnectionConstant'
import Contextmenu from '@/components/ui/contextmenu/src/contextmenu-install'
import { type ConnectionType, useConnectionStore } from '@/stores/ConnectionStore'
import { useComponentRef } from '@/components/element-plus/elemenet-plus-util'
import { Message, MessageBox } from '@/components/element-plus/el-feedback-util'

defineOptions({
  name: 'ConnectionListComponent'
})

const openCreateConnection = inject<(data?: ConnectionInfo<BaseConnectionDetail>, db?: DatabaseIdent) => void>(InjectionKey.openCreateConnection)
const openCreateGroup = inject<(data?: ConnectionGroup) => void>(InjectionKey.openCreateGroup)

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

const treeItemContextmenu = (event: MouseEvent, data: ConnectionType) => {
  if (data.dbType === 'group') {
    Contextmenu({
      event,
      menus: [
        {
          label: '新建组',
          onClick: () => {
            openCreateGroup?.()
          }
        },
        {
          label: '删除组',
          onClick: async () => {
            const { status, message } = await connectionStore.removeGroupById(data)
            if (status === 'success') {
              Message.success(message)
            } else {
              await MessageBox.error(message)
            }
          }
        },
        {
          label: '重命名',
          onClick: () => {
            openCreateGroup?.(data)
          }
        }
      ]
    })
  }
}
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
      :expand-on-click-node="false"
      empty-text="暂无数据库连接"
    >
      <template #default="{ node, data }">
        <div
          class="dbtu-un-user-select tree-item"
          @contextmenu.prevent="treeItemContextmenu($event, data)"
        >
          <div class="tree-node__main">
            <el-icon>
              <IconFolder/>
            </el-icon>
            <span>{{ node.label }}</span>
          </div>
          <el-icon
            class="tree-node__more"
            @click.stop="treeItemContextmenu($event, data)"
          >
            <IconMoreFilled/>
          </el-icon>
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
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 34px;
  gap: var(--dbtu-icon-text-gap);

  .tree-node__main {
    display: flex;
    align-items: center;
    gap: var(--dbtu-icon-text-gap);
  }

  .tree-node__more {
    display: none;
    margin-right: 12px;
  }
}

:deep(.el-tree-node) {
  .el-tree-node__content:hover .tree-node__more,
  &:focus .tree-node__more {
    display: block;
  }
}
</style>