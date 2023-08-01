import { JudgeConditions } from '@/common/constants/ConnectionConstant'

export interface SizerDrawerProp {
  /**
   * 标题
   */
  title: string

  /**
   * 字段列表
   */
  fields: string[]

  /**
   * Drawer 自身是否插入至 body 元素上。嵌套的 Drawer 必须指定该属性并赋值为 true
   *
   * @default false
   */
  appendToBody?: boolean
}

export const SizerDrawerPropDefault: Record<keyof SizerDrawerProp, any> = {
  title: '',
  fields: [],
  appendToBody: false
}

export const TreeV2Props = {
  label: 'field',
  children: 'children'
}

export interface ConditionItem {
  id: number
  field: string
  condition: keyof typeof JudgeConditions
  value: number | string | boolean
  relation: 'AND' | 'OR'
  children?: ConditionItem[]
  childrenRelation?: 'AND' | 'OR'
  // 1 = true, 0 = false
  use: number
}
