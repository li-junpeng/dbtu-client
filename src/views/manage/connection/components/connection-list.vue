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
  FolderAdd as IconFolderAdd,
  Minus as IconMinus,
  MoreFilled as IconMoreFilled,
  Plus as IconPlus
} from '@element-plus/icons-vue'
import { InjectionKey } from '@/common/constants/ConnectionConstant'
import Contextmenu from '@/components/ui/contextmenu/src/contextmenu-install'
import { type ConnectionType, useConnectionStore } from '@/stores/ConnectionStore'
import { useComponentRef } from '@/components/element-plus/elemenet-plus-util'
import { Message, MessageBox } from '@/components/element-plus/el-feedback-util'
import TreeNodeIcon from './tree-node-icon.vue'
import { NumberUtils } from '@/common/utils/NumberUtils'
import { TextConstant } from '@/common/constants/TextConstant'
import { useConnectionSessionStore } from '@/stores/ConnectionSessionStroe'

defineOptions({
  name: 'ConnectionListComponent'
})

const tooltipShowAfter = 600
const openCreateConnection = inject<
  (data?: ConnectionInfo<BaseConnectionDetail>, db?: DatabaseIdent, groupId?: number) => void
>(InjectionKey.openCreateConnection)
const openCreateGroup = inject<(data?: ConnectionGroup) => void>(InjectionKey.openCreateGroup)

const treeProps = {
  value: 'id',
  label: 'name',
  children: 'children',
}

const treeHeight = ref(400)
const treeRef = useComponentRef(ElTreeV2)
const connectionStore = useConnectionStore()
const connectionSessionStore = useConnectionSessionStore()
const connections = connectionStore.findOrderByName()

const loadConnections = () => {
  treeRef.value?.setData(connectionStore.findOrderByName())
  connectionSessionStore.refresh()
}

watch(() => connectionStore.refreshConnectionFlag, () => {
  loadConnections()
})

watch(() => connectionStore.defaultExpandedKeys, () => {
  treeRef.value?.setExpandedKeys(connectionStore.defaultExpandedKeys)
}, {deep: true})

onMounted(() => {
  const $dom = document.querySelector('.box-content')
  treeHeight.value = $dom?.clientHeight || 400
})

defineExpose({
  loadConnections
})

const groupContextmenu = (event: MouseEvent, data: ConnectionGroup) => {
  Contextmenu({
    event,
    menus: [
      {
        label: '新建连接',
        divided: true,
        onClick: () => {
          openCreateConnection?.(void 0, void 0, data.id as number)
        }
      },
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
            loadConnections()
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

const connectionContextmenu = (event: MouseEvent, connection: ConnectionInfo<BaseConnectionDetail>) => {

  const connectionId = connection.id as number

  // 打开连接
  const openConnection = async () => {
    const session = connectionSessionStore.create(connection)
    connection.status = 'connecting'
    const { status, message } = await session.open()
    if (status === 'success') {
      setTimeout(() => {
        connection.status = 'connected'
        connectionStore.setExpandKey(connectionId)
        loadConnections()
      }, 1000)
    } else {
      throw new Error(message)
    }
  }

  // 关闭连接
  const closeConnection = async () => {
    connection.status = 'connecting'
    const session = connectionSessionStore.get(connectionId)
    if (!session) {
      await MessageBox.error('无法正常关闭数据库连接，请刷新页面后再试。')
      return
    }

    const { status, message } = await session.close()
    if (status === 'success') {
      connection.status = 'no_connection'
      connectionStore.removeExpandKey(connectionId)
      connectionSessionStore.destroy(connectionId)
      loadConnections()
    } else {
      throw new Error(message)
    }
  }

  Contextmenu({
    event,
    menus: [
      {
        label: connection.status === 'connected'
          ? '关闭连接'
          : connection.status === 'connecting'
            ? '正在连接'
            : '打开连接',
        divided: true,
        disabled: connection.status === 'connecting',
        onClick: async () => {
          try {
            if (connection.status === 'no_connection') {
              await openConnection()
            } else {
              await closeConnection()
            }
          } catch (e) {
            await MessageBox.error((e as Error).message)
          }
        }
      },
      {
        label: '编辑连接',
        disabled: connection.status === 'connecting',
        onClick: () => {
          if (connection.status === 'connected') {
            MessageBox.confirm({
              msg: '此操作必须要关闭连接，确定要关闭连接吗？',
              useLoading: true,
              loadingText: '正在关闭'
            }, async (done) => {
              try {
                await closeConnection()
                done()
                openCreateConnection?.(connection)
              } catch (e) {
                await MessageBox.error((e as Error).message)
              }
            })
          } else {
            openCreateConnection?.(connection)
          }
        }
      },
      {
        label: '新建连接',
        onClick: () => {
          openCreateConnection?.(void 0, connection.dbType)
        }
      },
      {
        label: '删除连接',
        onClick: () => {
          MessageBox.deleteConfirm(TextConstant.deleteConfirm(connection.name), async (done) => {
            const { status, message } = await connectionStore.removeById(connectionId)
            if (status === 'success') {
              Message.success(message)
              connectionStore.removeExpandKey(connectionId)
              connectionSessionStore.destroy(connectionId)
              loadConnections()
            } else {
              await MessageBox.error(message)
            }

            done()
          })
        }
      },
      {
        label: '复制连接',
        divided: true,
        onClick: async () => {
          const { status, message } = await connectionStore.copyConnection(connection)
          if (status === 'success') {
            Message.success(message)
            loadConnections()
          } else {
            await MessageBox.error(message)
          }
        }
      },
      {
        label: '新建数据库',
        disabled: true
      },
      {
        label: '新建查询',
        disabled: true,
        divided: true
      },
      {
        label: '运行SQL文件',
        divided: true,
        disabled: true
      },
      {
        label: '从组中移除',
        hidden: NumberUtils.isEmpty(connection.groupId),
        onClick: () => {
          connectionStore.removeInGroup(connection)
          loadConnections()
        }
      },
      {
        label: '刷新',
        disabled: true
      }
    ]
  })
}

const treeItemContextmenu = (event: MouseEvent, data: ConnectionType) => {
  switch (data.nodeType) {
    case 'group':
      groupContextmenu(event, data as ConnectionGroup)
      break
    case 'connection':
      connectionContextmenu(event, data as ConnectionInfo<BaseConnectionDetail>)
      break
    case 'database':
    case 'table':
    case 'table_instance':
    case 'view':
    case 'view_instance':
      const session = connectionSessionStore.get(data.sessionId as number)
      if (!session) {
        MessageBox.error('未找到数据库连接会话信息，请刷新页面后再试。')
      }
      session.nodeContextmenu(event, data)
      break
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
        :show-after="tooltipShowAfter"
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
        :show-after="tooltipShowAfter"
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
        :show-after="tooltipShowAfter"
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
      :default-expanded-keys="connectionStore.defaultExpandedKeys"
      @node-expand="data => connectionStore.setExpandKey(data.id)"
      @node-collapse="data => connectionStore.removeExpandKey(data.id)"
      empty-text="暂无数据库连接"
    >
      <template #default="{ node, data }">
        <div
          class="dbtu-un-user-select tree-item"
          @contextmenu.prevent="treeItemContextmenu($event, data)"
        >
          <div class="tree-node__main">
            <tree-node-icon :node-data="data"/>
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
