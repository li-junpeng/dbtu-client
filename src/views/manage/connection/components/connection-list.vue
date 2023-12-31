<!--
 * 连接列表
 *
 * @author Junpeng.Li
 * @date 2023-07-14 16-35
-->
<script setup lang="ts">
import { InjectionKey } from '@/common/constants/ConnectionConstant'
import Contextmenu from '@/components/ui/contextmenu/src/contextmenu-install'
import { useConnectionStore } from '@/stores/ConnectionStore'
import { useConnectionSessionStore } from '@/stores/ConnectionSessionStore'
import { useWorkTabStore } from '@/stores/WorkTabStore'
import { useComponentRef } from '@/components/element-plus/element-plus-util'
import { Message, MessageBox } from '@/components/element-plus/el-feedback-util'
import TreeNodeIcon from './tree-node-icon.vue'
import { NumberUtils } from '@/common/utils/NumberUtils'
import { TextConstant } from '@/common/constants/TextConstant'

defineOptions({
  name: 'ConnectionListComponent'
})

const tooltipShowAfter = 600
const openCreateConnection = inject<(data?: ConnectionInfo<BaseConnectionDetail>, db?: DatabaseIdent, groupId?: number) => void>(
  InjectionKey.openCreateConnection
)
const openCreateGroup = inject<(data?: ConnectionGroup) => void>(InjectionKey.openCreateGroup)

const treeProps = {
  value: 'id',
  label: 'name',
  children: 'children'
}

const treeRef = useComponentRef(ElTreeV2)
const connectionStore = useConnectionStore()
const connectionSessionStore = useConnectionSessionStore()
const workTabStore = useWorkTabStore()
const connections = connectionStore.findOrderByName()

const loadConnections = () => {
  treeRef.value?.setData(connectionStore.findOrderByName())
  connectionSessionStore.refresh()
}

watch(
  () => connectionStore.refreshConnectionFlag,
  () => {
    loadConnections()
  }
)

watch(
  () => connectionStore.defaultExpandedKeys,
  () => {
    treeRef.value?.setExpandedKeys(connectionStore.defaultExpandedKeys)
  },
  { deep: true }
)

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
  const connectionId = connection.id!

  // 打开连接
  const openConnection = async () => {
    const session = connectionSessionStore.create(connection)
    connection.status = 'connecting'
    try {
      await session.open()
      connection.status = 'connected'
      connectionStore.setExpandKey(connectionId)
      loadConnections()
    } catch (e) {
      connection.status = 'no_connection'
      throw new Error(e as string)
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

    try {
      await session.close()
      connection.status = 'no_connection'
      connectionStore.removeExpandKey(connectionId)
      connectionSessionStore.destroy(connectionId)
      workTabStore.closeTabsBySessionId(connectionId)
      loadConnections()
    } catch (e) {
      connection.status = 'connected'
      throw new Error(e as string)
    }
  }

  // 刷新连接
  const refreshConnection = async () => {
    const session = connectionSessionStore.get(connection.sessionId!)
    connection.status = 'connecting'
    try {
      await session.refresh()
      loadConnections()
    } catch(e) {
      MessageBox.error(e as string)
    } finally {
      connection.status = 'connected'
    }
  }

  Contextmenu({
    event,
    menus: [
      {
        label: connection.status === 'connected' ? '关闭连接' : connection.status === 'connecting' ? '正在连接' : '打开连接',
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
            MessageBox.confirm(
              {
                msg: '此操作必须要关闭连接，确定要关闭连接吗？',
                useLoading: true,
                loadingText: '正在关闭'
              },
              async done => {
                try {
                  await closeConnection()
                  done()
                  openCreateConnection?.(connection)
                } catch (e) {
                  await MessageBox.error((e as Error).message)
                }
              }
            )
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
          MessageBox.deleteConfirm(TextConstant.deleteConfirm(connection.name), async done => {
            const { status, message } = await connectionStore.removeById(connectionId)
            if (status === 'success') {
              Message.success(message)
              connectionStore.removeExpandKey(connectionId)
              connectionSessionStore.destroy(connectionId)
              workTabStore.closeTabsBySessionId(connectionId)
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
        disabled: connection.status === 'no_connection',
        onClick: () => {
          const session = connectionSessionStore.get(connectionId)
          session.openCreateDatabase()
        }
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
        disabled: !connection.groupId,
        hidden: NumberUtils.isEmpty(connection.groupId),
        onClick: () => {
          connectionStore.removeInGroup(connection)
          loadConnections()
        }
      },
      {
        label: '刷新',
        onClick: () => {
          refreshConnection()
        }
      }
    ]
  })
}

const treeItemContextmenu = (event: MouseEvent, data: ConnectionTreeNode) => {
  // 选中节点, 并手动触发点击节点事件
  treeRef.value?.setCurrentKey(data.id as number)
  onClickTreeItem(data)

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
    case 'function':
    case 'function_instance':
    case 'search':
    case 'search_instance':
    case 'backup':
    case 'backup_instance':
      const session = connectionSessionStore.get(data.sessionId!)
      if (!session) {
        MessageBox.error('未找到数据库连接会话信息，请刷新页面后再试。')
      } else {
        session.nodeContextmenu(event, data)
      }
      break
  }
}

const onClickTreeItem = (data: ConnectionTreeNode) => {
  if (data.nodeType !== 'group' && data.nodeType !== 'connection') {
    const session = connectionSessionStore.get(data.sessionId!)
    if (!session) {
      MessageBox.error('未找到数据库连接会话信息，请刷新页面后再试。')
    } else {
      session.onClickNode(data)
    }
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
              <IconFolderAdd />
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
          text
          link
          @click="() => openCreateConnection?.()"
        >
          <template #icon>
            <IconPlus />
          </template>
        </el-button>
      </el-tooltip>
      <el-tooltip
        content="最小化"
        :enterable="false"
        :show-after="tooltipShowAfter"
      >
        <el-button
          text
          link
        >
          <template #icon>
            <IconMinus />
          </template>
        </el-button>
      </el-tooltip>
    </div>
  </div>
  <div class="box-content">
    <el-auto-resizer>
      <template #default="{ height }">
        <el-tree-v2
          ref="treeRef"
          :data="connections"
          :props="treeProps"
          :height="height"
          :item-size="34"
          :expand-on-click-node="false"
          :default-expanded-keys="connectionStore.defaultExpandedKeys"
          highlight-current
          @node-expand="data => connectionStore.setExpandKey(data.id)"
          @node-collapse="data => connectionStore.removeExpandKey(data.id)"
          empty-text="暂无数据库连接"
        >
          <template #default="{ node, data }">
            <div
              class="dbtu-un-user-select tree-item"
              @click="onClickTreeItem(data)"
              @contextmenu.prevent="treeItemContextmenu($event, data)"
            >
              <div class="tree-node__main">
                <tree-node-icon :node-data="data" />
                <span>{{ node.label }}</span>
              </div>
              <el-icon
                class="tree-node__more"
                @click.stop="treeItemContextmenu($event, data)"
              >
                <IconMoreFilled />
              </el-icon>
            </div>
          </template>
        </el-tree-v2>
      </template>
    </el-auto-resizer>
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

:deep(.el-tree) {
  .el-tree-node {
    &.is-current .tree-node__more,
    .el-tree-node__content:hover .tree-node__more,
    &:focus .tree-node__more {
      display: block;
    }
  }
}
</style>
