import { defineStore } from 'pinia'
import { groupBy } from 'lodash'
import { MessageBox } from '@/components/element-plus/el-feedback-util'
import { TextConstant } from '@/common/constants/TextConstant'

export type ConnectionInfoType = ConnectionInfo<BaseConnectionDetail>

export type ConnectionType = ConnectionInfoType | ConnectionGroup

export type ConnectionsType = ConnectionType[]

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
      const groups = this.connections.filter(item => item.nodeType === 'group') as ConnectionGroup[]
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
      // 按名称排序
      this.connections.sort((item1, item2) => item1.name.localeCompare(item2.name))

      // 按类型分组，目的是将group排序到最前面
      const group = groupBy(this.connections, 'nodeType')
      const connections = [...group['group'], ...group['connection']]

      // 转换成tree数据结构
      const groupMap: Record<number, number> = {}
      const array = [] as ConnectionsType
      for (let i = 0; i < connections.length; i++) {
        const item = connections[i]
        if (item.nodeType === 'group') {
          (item as ConnectionGroup).children = []
          groupMap[item.id as number] = i
          array.push(item)
        } else if(item.nodeType === 'connection') {
          if ((item as ConnectionInfoType).groupId) {
            // @ts-ignore
            array[groupMap[item.groupId]].children.push(item)
          } else {
            array.push(item)
          }
        }
      }
      return array
    },

    /**
     * 创建分组
     *
     * @param data  分组数据
     */
    createGroup(data: ConnectionGroup): Promise<IResponse<ConnectionGroup>> {
      data.id = Date.now()
      data.nodeType = 'group'
      this.connections.push(data)
      return Promise.resolve({
        status: 'success',
        data,
        message: '分组创建成功'
      })
    },

    /**
     * 根据Id修改分组信息
     *
     * @param data
     */
    updateGroupById(data: ConnectionGroup): Promise<IResponse<ConnectionGroup>> {
      for (let i = 0; i < this.connections.length; i++) {
        if (this.connections[i].id === data.id) {
          this.connections[i] = data
          return Promise.resolve({
            status: 'success',
            data,
            message: '分组信息修改成功'
          })
        }
      }

      return Promise.reject('未找到对应的分组信息，请刷新页面后再试。')
    },

    /**
     * 创建连接
     *
     * @param data
     */
    createConnection(data: ConnectionInfo<BaseConnectionDetail>): Promise<IResponse<ConnectionInfoType>> {
      data.id = Date.now()
      data.nodeType = 'connection'
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
     * @param data      需要修改的连接信息
     */
    async updateById(data: ConnectionInfoType): Promise<IResponse<ConnectionInfoType>> {
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
     * 根据ID删除分组， 分组内的连接平铺到根节点
     *
     * @param data
     */
    removeGroupById(data: ConnectionGroup): Promise<IResponse<void>> {
      return new Promise((resolve, reject) => {
        MessageBox.deleteConfirm(TextConstant.deleteConfirm(data.name), (done) => {
          if (data.children) {
            for (let i = 0; i < data.children.length; i++) {
              data.children[i].groupId = void 0
            }
          }

          for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].id === data.id) {
              this.connections.splice(i, 1)
              break
            }
          }

          done()

          resolve({
            status: 'success',
            data: null,
            message: '删除成功'
          })
        }).then(() => {
        }).catch(() => {
          reject()
        })
      })
    },

    /**
     * 将连接从分组中移出
     *
     * @param data
     */
    removeInGroup(data: ConnectionInfo<BaseConnectionDetail>): Promise<IResponse<void>> {
      data.groupId = void 0

      return Promise.resolve({
        status: 'success',
        data: null,
        message: '从分组中移除成功'
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
