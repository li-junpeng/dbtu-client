import { defineStore } from 'pinia'
import type { ConnectionSession } from '@/components/database/connection-session'
import { ConnectionSessionFactory } from '@/components/database/connection-session'
import { useConnectionStore } from '@/stores/ConnectionStore'

export const useConnectionSessionStore = defineStore('useConnectionSessionStore', {
  state: () => {
    return {
      // key: sessionId = connectionId, value: 数据库的session实例
      // sessionId 就是连接Id
      sessions: {} as Record<number, ConnectionSession<BaseConnectionDetail>>
    }
  },

  actions: {
    /**
     * 获取session
     *
     * @param sessionId 数据库的连接会话ID(连接ID)
     * @returns
     */
    get(sessionId: number): ConnectionSession<BaseConnectionDetail> {
      return this.sessions[sessionId]
    },

    /**
     * 创建数据库连接会话
     *
     * @param connection  数据库连接信息
     */
    create(connection: ConnectionInfo<BaseConnectionDetail>): ConnectionSession<BaseConnectionDetail> {
      const session = ConnectionSessionFactory.createSession(connection.dbType, connection)
      this.sessions[connection.id!] = session
      return session
    },

    /**
     * 刷新数据库连接信息
     */
    refresh(): void {
      if (Object.keys(this.sessions).length === 0) {
        return
      }

      useConnectionStore().connections.forEach(item => {
        if (item.nodeType === 'connection') {
          if (this.sessions[item.id as number]) {
            this.create(item as ConnectionInfo<BaseConnectionDetail>)
          }
        }
      })
    },

    /**
     * 销毁
     *
     * @param connectionId  数据库连接ID
     */
    destroy(connectionId: number): void {
      delete this.sessions[connectionId]
    }
  },

  persist: {
    key: '__dbtu_connection_session',
    storage: localStorage,
    paths: ['sessions'],
    afterRestore: ctx => {
      setTimeout(() => {
        ctx.store.refresh()
      }, 300)
    }
  }
})
