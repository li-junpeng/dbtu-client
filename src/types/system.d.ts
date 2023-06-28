interface UserInfo {
  // key
  id: number
  // 昵称
  nickname: string
  // 邮箱
  email: string
  // 性别
  gender: GenderType
  // 职业
  job: string
  // 头像地址
  avatar: string
}

type ThemeMode = 'light' | 'dark'

interface SystemSetting {
  theme: {
    // 主题模式
    mode: ThemeMode
    // 主题颜色
    color: string
  }
}

// 系统设置中, 左侧导航tab信息
interface SystemSettingTabItem {
  key: SystemSettingTabKey
  title: string
  icon: never
  // 默认 = 'inherit'
  iconSize?: number
  component: string
}

// 系统设置tab页内容
type SystemSettingTabKey =
  | 'theme'         // 主题
  | 'proxy'         // 代理
  | 'keymap'        // 快捷键
  | 'security'      // 隐私与安全
