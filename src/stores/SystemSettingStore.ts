import { defineStore } from 'pinia'

export const useSystemSettingStore = defineStore('useSystemSettingStore', {
  state: () => {
    return {
      setting: getDefaultSetting()
    }
  },

  actions: {},

  persist: {
    key: '__dbtu_system_setting',
    storage: localStorage,
    paths: ['setting']
  }
})

/**
 * 获取系统设置（默认值）
 *
 * @return 系统设置默认值
 */
const getDefaultSetting = (): SystemSetting => {
  return {}
}
