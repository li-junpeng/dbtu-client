<!--
 * 连接列表
 *
 * @author Junpeng.Li
 * @date 2023-07-14 16-35
-->
<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
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
import { ConnectionSession, ConnectionSessionFactory } from '@/components/database/connection-session'
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
}

onMounted(() => {
  const $dom = document.querySelector('.box-content')
  treeHeight.value = $dom?.clientHeight || 400

  // TODO 刷新页面后，无法创建session
  for (let connectionId in connectionSessionStore.sessions) {
    const connection = connectionSessionStore.sessions[connectionId].connection
    connectionSessionStore.sessions[connectionId] = ConnectionSessionFactory.createSession(connection.dbType, connection)
  }
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
  Contextmenu({
    event,
    menus: [
      {
        // TODO 需要判断是否已经是打开状态
        label: connection.status === 'connected'
          ? '关闭连接'
          : connection.status === 'connecting'
            ? '正在连接'
            : '打开连接',
        divided: true,
        disabled: connection.status === 'connecting',
        onClick: async () => {
          const connectionId = connection.id as number
          if (connection.status === 'no_connection') {
            // 打开连接
            const session = connectionSessionStore.create(connection)
            connection.status = 'connecting'
            const { data } = await session.open()
            setTimeout(() => {
              connection.status = 'connected'
              connectionStore.setExpandKey(connectionId)
              treeRef.value?.setExpandedKeys(connectionStore.defaultExpandedKeys)
              loadConnections()
            }, 1000)
          } else {
            // 关闭连接
            connection.status = 'connecting'
            const session = connectionSessionStore.get(connectionId)
            if (!session) {
              await MessageBox.error('无法正常关闭数据库连接，请刷新页面后再试。')
              return
            }
            const { status, message } = await session.close()
            if (status === 'success') {
              connectionSessionStore.destroy(connectionId)
              setTimeout(() => {
                connection.status = 'no_connection'
                connectionStore.removeExpandKey(connectionId)
                loadConnections()
              }, 1000)
            } else {
              await MessageBox.error(message)
            }
          }
        }
      },
      {
        label: '编辑连接',
        onClick: () => {
          // TODO 如果是打开连接状态，就提示
          openCreateConnection?.(connection)
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
            const { status, message } = await connectionStore.removeById(connection.id as number)
            if (status === 'success') {
              Message.success(message)
              loadConnections()
              connectionStore.removeExpandKey(connection.id as number)
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
