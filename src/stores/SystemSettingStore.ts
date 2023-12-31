import { ref } from 'vue'
import { defineStore } from 'pinia'
import { StringUtils } from '@/common/utils/StringUtils'
import { TinyColor } from '@ctrl/tinycolor'
import { FONT_SIZE_DEFAULT, FONT_SIZE_MAX, FONT_SIZE_MIN } from '@/common/constants/SystemConstant'
import { useDark } from '@vueuse/core'

// #region icons start //
import IconTheme from '@/icons/svg/theme.vue'
import IconProxy from '@/icons/svg/proxy.vue'
import IconKeymap from '@/icons/svg/keymap.vue'
import IconSecurity from '@/icons/svg/security.vue'
// #endregion icons end //

export const navTabs = [
  {
    key: 'theme',
    title: '主题',
    icon: IconTheme,
    component: './setting-theme.vue'
  },
  {
    key: 'proxy',
    title: '代理服务器',
    icon: IconProxy,
    component: './setting-proxy-server.vue'
  },
  {
    key: 'keymap',
    title: '快捷键',
    icon: IconKeymap,
    component: ''
  },
  {
    key: 'security',
    title: '隐私与安全',
    icon: IconSecurity,
    iconSize: 16,
    component: ''
  }
] as SystemSettingTabItem[]

export const useSystemSettingStore = defineStore('useSystemSettingStore', {
  state: () => {
    return {
      setting: getDefaultSetting(),
      // 系统设置对话框的可见性
      visible: ref(false),
      // 当前激活的选项卡
      activeTab: ref<SystemSettingTabItem | null>(null),

      /**
       * 数据源连接列表区域的宽度和高度
       */
      connectionListSize: {
        width: '300px',
        height: '100%'
      }
    }
  },

  actions: {
    /**
     * 打开对话框
     *
     * @param tabKey  默认选中的选项卡标识
     */
    open(tabKey?: SystemSettingTabKey) {
      let tabItem = StringUtils.isNotEmpty(tabKey as string) ? navTabs.find(tab => tab.key === tabKey) : this.activeTab
      if (!tabItem) {
        tabItem = navTabs[0]
      }
      this.activeTab = tabItem
      this.visible = true
    },

    getSetting(): SystemSetting {
      return this.setting
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

      if (mode === 'auto') {
        mode = useDark().value ? 'dark' : 'light'
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

      const $root = document.querySelector(':root') as HTMLElement
      if (!$root || !color) {
        return
      }

      const { active, hover, disabled } = generateThemeColors(color as string)
      const variables: Record<string, string> = {
        '--dbtu-theme-color': color,
        '--dbtu-theme-active-color': active,
        '--dbtu-theme-hover-color': hover,
        '--dbtu-theme-disabled-color': disabled
      }

      const $style = $root.style
      for (let key in variables) {
        $style.setProperty(key, variables[key])
      }
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

      const $root = document.querySelector(':root') as HTMLElement
      if (!$root) {
        return
      }

      if (size === null || StringUtils.isEmpty(size + '')) {
        size = FONT_SIZE_DEFAULT
      }

      if (size < FONT_SIZE_MIN) {
        size = FONT_SIZE_MIN
      } else if (size > FONT_SIZE_MAX) {
        size = FONT_SIZE_MAX
      }

      $root.style.setProperty('--dbtu-font-size', `${size}px`)
    }
  },

  persist: {
    key: '__dbtu_system_setting',
    storage: localStorage,
    paths: ['setting', 'connectionListSize']
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
      color: '#3574f0',
      fontSize: FONT_SIZE_DEFAULT,
      layout: 'normal'
    }
  }
}

/**
 * 根据主题颜色，自动生成active、hover的颜色值
 *
 * @param themeColor 需要生成的原始颜色
 */
const generateThemeColors = (
  themeColor: string
): {
  // active color
  active: string
  // hover color
  hover: string
  // disabled color
  disabled: string
} => {
  // 注意: `TinyColor`是element-plus依赖的, 如果把element-plus卸载了, 请自行安装`TinyColor`
  // `TinyColor`安装和使用说明参考: https://tinycolor.vercel.app/docs
  const _color = new TinyColor(themeColor)
  return {
    // 参考element-plus中的el-button实现
    // 源码url: https://github.com/element-plus/element-plus/blob/dev/packages/components/button/src/button-custom.ts
    active: _color.mix('#141414', 20).toString(),
    hover: _color.tint(30).toString(),
    disabled: _color.tint(50).toString()
  }
}
