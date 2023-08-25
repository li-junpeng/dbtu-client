/**
 * 数据库的数据类型转成js的数据类型, 方便不同的数据库统一管理
 */
type DbDataType = 'string' | 'number' | 'date' | 'time' | 'datetime' | 'blob' | 'enum'

/**
 * 实体类基础字段
 */
interface BaseEntity {
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
}

/**
 * 用户信息
 */
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

/**
 * 主题模式
 */
type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * 系统设置配置项
 */
interface SystemSetting {
  // 主题 & 外观
  theme: {
    // 主题模式
    mode: ThemeMode
    // 主题颜色
    color: string
    // 字体大小
    fontSize: number
    // 布局
    layout: 'normal' | 'no-header'
  }
}

/**
 * 系统设置中, 左侧导航tab信息
 */
interface SystemSettingTabItem {
  key: SystemSettingTabKey
  title: string
  icon: never
  // 默认 = 'inherit'
  iconSize?: number
  component: string
}

/**
 * 系统设置tab页内容
 */
type SystemSettingTabKey =
  | 'theme' // 主题
  | 'proxy' // 代理
  | 'keymap' // 快捷键
  | 'security' // 隐私与安全

/**
 * el-select option
 * <br>
 * doc link: https://element-plus.org/zh-CN/component/select.html#option-attributes
 */
interface ElSelectOption<T extends string | number | boolean | object> {
  // 选项的标签，若不设置则默认与value相同
  label: string | number
  // 选项的值
  value: T
  // 是否禁用该选项, 默认false
  disabled?: boolean
}

/**
 * 通用请求响应体
 *
 * @param T 响应数据的类型
 */
interface IResponse<T> {
  // 状态标识
  status: 'success' | 'fail'
  // 数据
  data: T | null
  // 消息内容
  message: string
  // 状态码
  code: number
}

/**
 * 使其对象中的某些个必填字段变成可选字段。
 *
 * @example
 * interface User {
 *   id: number
 *   name: string
 *   email: string
 *   password: string
 *   age: number
 *   sex: '男' | '女'
 * }
 *
 * // 现在我要初始化一个用户对象，但是呢，我又不想填写`email`和`password`，可以这样使用:
 * const user = {
 *   id: 1,
 *   name: 'Junpeng.Li'
 *   age: 18,
 *   sex: '男'
 * } as Optional<User, 'email' | 'password'>
 *
 * @param T 原始对象
 * @param K 需要变成可选的字段名，比如: 'name' | 'age' | 'password'
 */
type Optional<T, K extends typeof T> = Omit<T, K> & Partial<Pick<T, K>>

type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]

/**
 * 将可选字段变为必填字段, 将必填字段变为可选字段
 *
 * @example
 * interface Foo {
 *    a: string
 *    b?: string
 * }
 *
 * type Bar = Flip<Foo>
 * // 输出如下:
 * type Bar = {
 *    a?: string
 *    b: string
 * }
 */
type Flip<T> = Required<Pick<T, OptionalKeys<T>>> & Partial<Omit<T, OptionalKeys<T>>> extends infer O ? { [K in keyof O]: O[K] } : never
