import { defineStore } from 'pinia'

export const useConnectionStore = defineStore('useConnectionStore', {

  state: () => {
    return {
      connections: [] as ConnectionInfo<BaseConnectionDetail>[]
    }
  },

  actions: {

    /**
     * 创建连接
     *
     * @param data
     */
    async create(data: ConnectionInfo<BaseConnectionDetail>): Promise<IResponse<ConnectionInfo<BaseConnectionDetail>>> {
      data.id = Date.now()
      this.connections.push(data)
      return Promise.resolve({
        status: 'success',
        data,
        message: `数据库连接 "${data.name}" 创建成功`
      })
    },

    /**
     * 根据id删除连接
     *
     * @param id 数据库连接ID
     */
    removeById(id: number): Promise<IResponse<void>> {
      for (let i = 0; i < this.connections.length; i++) {
        const connection = this.connections[i]
        if (id === connection.id) {
          // TODO 删除之前先关掉数据库连接session
          this.connections.slice(i, 1)
          return Promise.resolve({
            status: 'success',
            data: null,
            message: `数据库连接 "${connection.name}" 删除成功`
          })
        }
      }

      return Promise.reject("删除失败，未找到相关数据库连接，请刷新页面后再试")
    }

  },

  persist: {
    key: '__dbtu_connection',
    storage: localStorage,
    paths: ['connections']
  }

})
