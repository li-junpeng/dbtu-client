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
      objectPaneProps: {}
    }
  },

  actions: {

    setObjectPane(option: ObjectPaneOption): void {
      option.component().then(() => {
        this.objectPaneProps = option.props
        this.objectPaneComponent = defineAsyncComponent(option.component)
      })
    }

  }

})
