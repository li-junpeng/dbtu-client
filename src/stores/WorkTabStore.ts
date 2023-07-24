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

    setObjectPane(option: ObjectPaneOption): void {
      // 防止重复点击
      if (this.objectPaneProps.id === option.props.id) {
        return
      }

      option.component().then(() => {
        this.objectPaneProps = option.props
        this.objectPaneComponent = defineAsyncComponent(option.component)
      })
    }

  }

})
