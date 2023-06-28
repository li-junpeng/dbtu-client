import { defineStore } from 'pinia'
import { StringUtils } from '@/common/utils/StringUtils'

export const useSystemSettingStore = defineStore('useSystemSettingStore', {
  state: () => {
    return {
      setting: getDefaultSetting()
    }
  },

  actions: {

    getSetting(): SystemSetting {
      return this.setting
    },

    setSetting(setting: SystemSetting) {
      this.setting = setting
    },

    /**
     * 根据`this.setting`数据, 设置主题样式
     */
    updateTheme() {
      this.updateThemeMode()
      this.updateThemeColor()
    },

    /**
     * 修改主题模式
     *
     * @param mode 模式
     */
    updateThemeMode(mode?: ThemeMode) {
      if (StringUtils.isEmpty(mode)) {
        mode = this.setting.theme.mode
      }

      const $html = document.body
      $html.className = `dbtu-common-theme dbtu-theme-${mode}`
    },

    /**
     * 修改主题颜色
     *
     * @param color 颜色值
     */
    updateThemeColor(color?: string) {
      if (StringUtils.isEmpty(color)) {
        color = this.setting.theme.color
      }

      const $root = document.querySelector(':root')
      if (!$root) {
        return
      }

      // @ts-ignore
      $root.style.setProperty('--dbtu-theme-color', color)
    }

  },

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
  return {
    theme: {
      mode: 'dark',
      color: '#3574f0'
    }
  }
}
