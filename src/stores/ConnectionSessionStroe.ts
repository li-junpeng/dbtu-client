import { defineStore } from 'pinia'
import type { ConnectionSession } from '@/components/database/connection-session'
import { ConnectionSessionFactory } from '@/components/database/connection-session'

export const useConnectionSessionStore = defineStore('useConnectionSessionStore', {

  state: () => {
    return {
      sessions: {} as Record<number, ConnectionSession<BaseConnectionDetail>>
    }
  },

  actions: {

    get(connectionId: number): ConnectionSession<BaseConnectionDetail> {
      return this.sessions[connectionId]
    },

    /**
     * 创建数据库连接会话
     *
     * @param connection  数据库连接信息
     */
    create(connection: ConnectionInfo<BaseConnectionDetail>): ConnectionSession<BaseConnectionDetail> {
      const session = ConnectionSessionFactory.createSession(connection.dbType, connection)
      this.sessions[connection.id as number] = session
      return session
    },

    /**
     * 销毁
     *
     * @param connectionId   数据库连接的ID
     */
    destroy(connectionId: number): void {
      delete this.sessions[connectionId]
    }

  },

  persist: {
    key: '__dbtu_connection_session',
    storage: localStorage,
    paths: ['sessions']
  }

})
