import { defineStore } from 'pinia'

type ConnectionInfoType = ConnectionInfo<BaseConnectionDetail>

export const useConnectionStore = defineStore('useConnectionStore', {

  state: () => {
    return {
      connections: [] as ConnectionInfoType[]
    }
  },

  actions: {

    /**
     * 创建连接
     *
     * @param data
     */
    create(data: ConnectionInfo<BaseConnectionDetail>): Promise<IResponse<ConnectionInfoType>> {
      data.id = Date.now()
      data.status = 'no_connection'
      this.connections.push(data)
      return Promise.resolve({
        status: 'success',
        data,
        message: '数据库连接创建成功'
      })
    },

    /**
     * 根据ID修改连接信息
     *
     * @param data   需要修改的连接信息
     */
    updateById(data: ConnectionInfoType): Promise<IResponse<ConnectionInfoType>> {
      for (let i = 0; i < this.connections.length; i++) {
        if (data.id === this.connections[i].id) {
          // TODO 修改之前记得把数据库连接session断开
          this.connections[i] = data
          return Promise.resolve({
            status: 'success',
            data,
            message: '数据库连接修改成功'
          })
        }
      }

      return Promise.resolve({
        status: 'fail',
        data,
        message: '修改失败，未找到相关数据库连接，请刷新页面后再试。'
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
          this.connections.splice(i, 1)
          return Promise.resolve({
            status: 'success',
            data: null,
            message: `数据库连接 "${connection.name}" 删除成功`
          })
        }
      }

      return Promise.resolve({
        status: 'fail',
        data: null,
        message: '删除失败，未找到相关数据库连接，请刷新页面后再试。'
      })
    }

  },

  persist: {
    key: '__dbtu_connection',
    storage: localStorage,
    paths: ['connections']
  }

})
