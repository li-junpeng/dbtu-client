import { defineStore } from 'pinia'
import { NumberUtils } from '@/common/utils/NumberUtils'

export type ConnectionInfoType = ConnectionInfo<BaseConnectionDetail>

export type ConnectionsType = (ConnectionInfoType | ConnectionGroup)[]

export const useConnectionStore = defineStore('useConnectionStore', {

  state: () => {
    return {
      connections: [] as ConnectionsType
    }
  },

  actions: {

    /**
     * 获取所有的分组列表
     *
     * @returns 分组列表
     */
    findGroups(): ConnectionGroup[] {
      const groups = this.connections.filter(item => item.dbType === 'group') as ConnectionGroup[]
      // 按名称排序
      groups.sort((item1, item2) => item1.name.localeCompare(item2.name))
      return groups
    },

    /**
     * 获取所有分组和连接
     *
     * @returns 连接列表
     */
    findOrderByName(): ConnectionsType {
      this.connections.sort((item1, item2) => item1.name.localeCompare(item2.name))
      return this.connections
    },

    /**
     * 创建分组
     *
     * @param data  分组数据
     */
    createGroup(data: ConnectionGroup): Promise<IResponse<ConnectionGroup>> {
      data.id = Date.now()
      this.connections.push(data)
      return Promise.resolve({
        status: 'success',
        data,
        message: '分组创建成功'
      })
    },

    /**
     * 创建连接
     *
     * @param data
     */
    createConnection(data: ConnectionInfo<BaseConnectionDetail>): Promise<IResponse<ConnectionInfoType>> {
      data.id = Date.now()
      data.status = 'no_connection'
      if (NumberUtils.isEmpty(data.groupId)) {
        this.connections.push(data)
      } else {
        const groups = this.findGroups()
        for (let i = 0; i < groups.length; i++) {
          if (groups[i].id === data.groupId) {
            if (!groups[i].children) {
              groups[i].children = []
            }
            groups[i].children?.push(data)
            break
          }
        }
      }

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
