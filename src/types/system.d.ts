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

interface SystemSetting {

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
  | 'theme'
  | 'proxy'
  | 'keymap'
  | 'security'
