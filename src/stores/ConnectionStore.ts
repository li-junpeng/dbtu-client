import { defineStore } from 'pinia'
import { NumberUtils } from '@/common/utils/NumberUtils'
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

      return Promise.reject("未找到对应的分组信息，请刷新页面后再试。")
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
     * 根据ID删除分组， 分组内的连接平铺到根节点
     *
     * @param data
     */
    removeGroupById(data: ConnectionGroup): Promise<IResponse<void>> {
      return new Promise((resolve, reject) => {
        MessageBox.deleteConfirm(TextConstant.deleteConfirm(data.name), (done) => {
          if (data.children) {
            this.connections.push(...data.children)
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
        }).then(() => {}).catch(() => {
          reject()
        })
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
