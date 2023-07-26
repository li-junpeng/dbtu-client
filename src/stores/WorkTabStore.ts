import { defineStore } from 'pinia'
import { defineAsyncComponent, markRaw, shallowRef } from 'vue'

type ObjectPaneOption = {
  props: ConnectionTreeNode,
  component: () => Promise<{}>
}

export const useWorkTabStore = defineStore('useWorkTabStore', {

  state: () => {
    return {
      objectPaneComponent: shallowRef(),
      objectPaneProps: {} as ConnectionTreeNode,
      tabs: [] as WorkTabItem[],
      activeTabId: 'object-pane'
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
     * 根据sessionId关闭tab页
     *
     * @param sessionId   会话ID
     * @return true: 已关闭, false: 未匹配成功，未关闭
     */
    closeTabsBySessionId(sessionId: number): boolean {
      // 清空对象面板内容
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
    },

    /**
     * 添加tab页
     *
     * @param option
     */
    addTab(option: WorkTabItem): Promise<void> {
      // 重复打开同一个tab时，直接激活已创建的tab
      if (this.activeTabId) {
        const tab = this.tabs.find(item => item.id === option.id)
        if (tab) {
          this.activeTabId = tab.id
          return Promise.resolve()
        }
      }

      return new Promise((resolve, reject) => {
        try {
          // 动态加载组件
          (option.component as () => Promise<{}>)().then(() => {
            // @ts-ignore
            option.component = markRaw(defineAsyncComponent(option.component as () => Promise<{}>))
            this.tabs.push(option)
            this.activeTabId = option.id
            resolve()
          })
        } catch {
          reject('组件加载失败，请刷新页面后再试。')
        }
      })
    }
  }

})
