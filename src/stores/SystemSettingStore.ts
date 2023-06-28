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
      this.updateThemeFontSize()
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
    },

    /**
     * 修改显示字体
     *
     * @param size 字号（不带单位，缺省单位为：px）
     */
    updateThemeFontSize(size?: number) {
      if (size === null || size === undefined) {
        size = this.setting.theme.fontSize
      }

      const $root = document.querySelector(':root')
      if (!$root) {
        return
      }

      if (size === null || StringUtils.isEmpty(size + '') || size < 0) {
        size = DEFAULT_FONT_SIZE
      }

      console.log(size)

      // @ts-ignore
      $root.style.setProperty('--dbtu-font-size', `${size}px`)
    }

  },

  persist: {
    key: '__dbtu_system_setting',
    storage: localStorage,
    paths: ['setting']
  }
})

const DEFAULT_FONT_SIZE = 14
/**
 * 获取系统设置（默认值）
 *
 * @return 系统设置默认值
 */
const getDefaultSetting = (): SystemSetting => {
  return {
    theme: {
      mode: 'dark',
      color: '#3574f0',
      fontSize: DEFAULT_FONT_SIZE
    }
  }
}
