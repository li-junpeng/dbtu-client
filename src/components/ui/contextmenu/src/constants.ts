import type { Component, PropType } from 'vue'
import type { ExtractPropTypes } from 'vue'

/**
 * 菜单项
 */
export interface MenuItem {

    // 菜单名
    label: string

    // 是否禁用，默认false
    disabled?: boolean

    // 是否隐藏, 默认false
    hidden?: boolean

    // 子菜单。目前支持最多2级菜单，只能有一级子菜单
    children?: MenuItem[]

    // 图标地址
    icon?: string | Component

    // 是否显示菜单底部的分隔线
    divided?: boolean

    /**
     * 点击菜单项时的回调函数。<br>
     * 如果菜单项含有子菜单，那么此属性将不会触发
     *
     * @param {MenuItem} menu  当前点击的菜单项
     * @param {number} index   当前菜单项所在的索引
     * @return {void}
     */
    onClick?: (menu: MenuItem, index: number) => void

    // 加载, 如果设置为true则将icon替换为loading
    loading?: boolean

}

/**
 * 菜单配置项
 */
export interface ContextmenuOption {

    // 菜单项
    menus: MenuItem[]

    // 鼠标事件对象
    event?: MouseEvent

    // 是否显示icon
    showIcon?: boolean

    // 同css的z-index，默认为3
    zIndex?: number

    // 点击菜单项后关闭菜单，默认为true
    clickItemHide?: boolean

    // 显示子菜单项的触发方式，默认为hover
    childTrigger?: 'click' | 'hover'

    // 菜单插入的容器，默认插入到body下
    target?: string | HTMLElement

    // 宽度，如果类型为number，则单位为：px
    width?: number | string,

    // 最小宽度，180，单位：px
    minWidth?: number

    // 最大宽度，400，单位：px
    maxWidth?: number

    // 关闭前的回调函数，返回false可终止关闭
    beforeClose?: () => boolean

    // 私有属性，建议使用者不要给该属性赋值。可重复显示菜单
    _repeat?: boolean

}

export const contextmenuProps = {

    // 层级，默认0级
    layer: {
        type: Number,
        default: 0
    },

    // 是否显示icon
    showIcon: {
        type: Boolean,
        default: true
    },

    // 菜单项
    menus: {
        type: Array as PropType<MenuItem[]>,
        required: true
    },

    // 鼠标事件对象
    event: {
        type: Object as PropType<MouseEvent>,
        required: true
    },

    // 同css的z-index
    zIndex: {
        type: Number,
        default: 3
    },

    // 点击菜单项后关闭菜单，默认为true
    clickItemHide: {
        type: Boolean,
        default: true
    },

    // 显示子菜单项的触发方式，默认为hover
    childTrigger: {
        type: String as PropType<'click' | 'hover'>,
        default: 'hover'
    },

    // 关闭前的回调函数，返回false可终止关闭
    beforeClose: {
        type: Function as PropType<() => boolean>
    },

    // 宽度，如果类型为number，则单位为：px
    width: {
        type: [String, Number],
        default: 'auto'
    },

    // 最小宽度，180，单位：px
    minWidth: {
        type: Number,
        default: 180
    },

    // 最大宽度，400，单位：px
    maxWidth: {
        type: Number,
        default: 400
    },

    /**
     * 关闭菜单的回调函数
     *
     * @param {number} layer = props.layer
     */
    onClose: {
        type: Function as PropType<(layer?: number) => void>,
        default: () => {
            return () => {
            }
        }
    }

}

export type ContextmenuProps = ExtractPropTypes<typeof contextmenuProps>
