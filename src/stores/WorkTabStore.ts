import { defineStore } from 'pinia'
import { defineAsyncComponent, shallowRef } from 'vue'

type ObjectPaneOption = {
  props: ConnectionTreeNode,
  component: () => Promise<{}>
}

export const useWorkTabStore = defineStore('useWorkTabStore', {

  state: () => {
    return {
      objectPaneComponent: shallowRef(),
      objectPaneProps: {} as ConnectionTreeNode
    }
  },

  actions: {

    /**
     * 设置对象面板内容
     *
     * @param option    配置项
     */
    setObjectPane(option: ObjectPaneOption): void {
      // 防止重复点击
      if (this.objectPaneProps.id === option.props.id) {
        return
      }

      option.component().then(() => {
        this.objectPaneProps = option.props
        this.objectPaneComponent = defineAsyncComponent(option.component)
      })
    },

    /**
     * 根据sessionId清空对象面板
     *
     * @param sessionId   会话ID
     * @return true: 已关闭, false: 未匹配成功，未关闭
     */
    clearObjectPaneBySessionId(sessionId: number): boolean {
      if (this.objectPaneProps.sessionId === sessionId) {
        this.objectPaneComponent = null
        return true
      }
      return false
    },

    /**
     * 根据对象面板的prop情况对象面板(根据prop中的ID比较)
     *
     * @param instance   ObjectPaneOption.props
     * @return true: 已关闭, false: 未匹配成功，未关闭
     */
    clearObjectPaneByProp(instance: ConnectionTreeNode): boolean {
      if (this.objectPaneProps.id === instance.id) {
        this.objectPaneComponent = null
        return true
      }
      return false
    }

  }

})
