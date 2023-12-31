import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import { MessageBox } from '@/components/element-plus/el-feedback-util'
import { loadAsyncComponent } from '@/common/utils/AsyncLoadComponent'

/**
 * 对象面板组件定义
 *
 * - key: 唯一key,
 * - value: 对应的组件
 */
const ObjectPanelComponentDefine = {
  /**
   * MySQL表列表
   */
  MYSQL_TABLE_LIST: () => import('@/components/database/mysql/work-tabs/object-pane/table-list.vue')
}

/**
 * work-tab组件定义
 * 
 * - key: 唯一的key,
 * - value: 对应的组件
 */
const WorkTabComponentDefine = {
  /**
   * MySQL查看表数据
   */
  MYSQL_TABLE_DATA: () => import('@/components/database/mysql/work-tabs/table-data.vue'),

  /**
   * MySQL创建表
   */
  MYSQL_CREATE_TABLE: () => import('@/components/database/mysql/work-tabs/create-table/index.vue')
}

export type ObjectPanelComponentKey = keyof typeof ObjectPanelComponentDefine
export type WorkTabComponentKey = keyof typeof WorkTabComponentDefine

interface WorkTabItem {
  /**
   * ID
   * 建议使用下面规则设置ID:
   * ${功能, 比如: createTable、queryTable等驼峰命名}_${connectionId | sessionId}_${databaseName}_${table_id}
   * 建议直接调用workTabStore.generateId()函数生成ID
   */
  id: string

  /**
   * tab标签的名称
   */
  label: string

  /**
   * 是否需要保存的标识，值 = true时，在标签左侧显示*字符
   */
  saveFlag?: boolean

  /**
   * tab的内容组件
   */
  componentKey: WorkTabComponentKey

  /**
   * tab的内容组件, 不需要手动传入
   */
  _component?: () => Promise<{}> | {}

  /**
   * 传入组件的数据, 系统会自动往props里面添加`workTabId`(当前选项卡的ID)
   */
  props?: WorkTabItemProp

  /**
   * 数据持久化
   */
  data?: any
}

export const useWorkTabStore = defineStore('useWorkTabStore', {
  state: () => {
    return {
      objectPaneComponentKey: null as ObjectPanelComponentKey | null,
      objectPaneComponent: shallowRef(),
      objectPaneProps: {} as ConnectionTreeNode,
      tabs: {} as Record<string, WorkTabItem>,
      activeTabId: 'object-pane'
    }
  },

  actions: {
    /**
     * 设置对象面板内容
     *
     * @param props        传递的数据
     * @param componentKey 组件在`ObjectPanelComponentDefine`中的key
     * @param isForce      强制更新对象面板
     */
    setObjectPane(data: ConnectionTreeNode, componentKey: ObjectPanelComponentKey, isForce: boolean = false): void {
      // 防止重复点击
      if (this.objectPaneProps.id === data.id && !isForce) {
        return
      }

      this.objectPaneProps = data
      this.objectPaneComponent = loadAsyncComponent(ObjectPanelComponentDefine[componentKey])
      this.objectPaneComponentKey = componentKey
    },

    /**
     * 根据sessionId关闭tab页
     *
     * @param sessionId   会话ID
     * @return true: 已关闭, false: 未匹配成功，未关闭
     */
    closeTabsBySessionId(sessionId?: number): boolean {
      if (!sessionId) {
        return false
      }
      // 清空对象面板内容
      if (this.objectPaneProps.sessionId === sessionId) {
        this.objectPaneComponent = null
      }

      // 根据tabId判断有没有sessionId
      Object.keys(this.tabs).forEach(tabId => {
        if (tabId.indexOf(sessionId + '') >= 0) {
          this.closeById(tabId)
        }
      })
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
     *
     * @param flag        选项卡内的主要功能, 英文, 驼峰命名法
     * @param sessionId   connectionId or sessionId
     * @param args        内容会拼接到最后
     */
    generateId(flag: string, sessionId: number, args: (string | number)[]) {
      let str = `${flag}_${sessionId}`
      args.forEach(item => {
        str += `_${item}`
      })
      return str
    },

    /**
     * 添加tab页
     *
     * @param option tab页的属性
     * @param props  传给组件的prop
     */
    addTab(option: WorkTabItem, props?: Partial<WorkTabItemProp>): void {
      // 重复打开同一个tab时，直接激活已创建的tab
      if (this.activeTabId) {
        const tab = this.tabs[option.id]
        if (tab) {
          this.activeTabId = tab.id
          return
        }
      }

      try {
        if (!props) {
          props = {}
        }
        props.workTabId = option.id
        option.props = props as WorkTabItemProp
        this.tabs[option.id] = option
        this.activeTabId = option.id
        this.tabs[option.id]._component = loadAsyncComponent(WorkTabComponentDefine[option.componentKey], true)
      } catch {
        MessageBox.error('MySQL表数据组件加载失败，请刷新页面后再试。').then()
      }
    },

    /**
     * 关闭选项卡
     *
     * @param tabId   选项卡id
     */
    closeById(tabId: string) {
      delete this.tabs[tabId]
      this.activeTabId = 'object-pane'
    },

    /**
     * 根据传入的str使用tabId.indexOf()做比较, 如果满足条件则关闭这个work-tab
     *
     * @param str                   可能会出现在tabId中的字符
     * @param objectPanelPropField  在对象面板中可能出现的prop字段名，如果满足则关闭对象面板，不需要关闭对象面板的不需要传入该字段
     */
    closeByStr(str: string, objectPanelPropField?: string) {
      if (objectPanelPropField) {
        // @ts-ignore
        if (this.objectPaneProps[objectPanelPropField] === str) {
          this.clearObjectPaneByProp(this.objectPaneProps)
        }
      }

      // 删除work-tab
      Object.keys(this.tabs).forEach(tabId => {
        if (tabId.indexOf(str) >= 0) {
          this.closeById(tabId)
        }
      })
    },

    /**
     * 初始化work-tab
     */
    _initWorkTab() {
      // 循环this.tabs，获取key和value
      for (let key in this.tabs) {
        this.tabs[key]._component = loadAsyncComponent(WorkTabComponentDefine[this.tabs[key].componentKey], true)
      }
    }
  },

  persist: {
    key: '__dbtu_work_tab',
    storage: sessionStorage,
    paths: ['objectPaneProps', 'objectPaneComponentKey', 'tabs', 'activeTabId'],
    afterRestore: () => {
      const store = useWorkTabStore()

      // 初始化对象面板
      if (!store.objectPaneComponentKey) return
      store.setObjectPane(store.objectPaneProps, store.objectPaneComponentKey!, true)

      // 初始化work-tab
      store._initWorkTab()
    }
  }
})
