import { type CSSProperties, onMounted, onUnmounted, reactive, type Ref } from 'vue'
import type { ContextmenuProps } from './constants'
import type { MenuItem } from './constants'
import { ApContextmenu } from './contextmenu-install'

export const useContextmenu = (props: ContextmenuProps, comRef: Ref<HTMLElement | undefined>) => {
  // 最多支持的菜单层级, 现在支持2级菜单(因为菜单层级是从0级开始计算的)
  const maxItemLv = 1
  const wrapperStyle = reactive<CSSProperties>({
    zIndex: props.zIndex || 3,
    top: 0,
    left: 0,
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    minWidth: `${props.minWidth}px`,
    maxWidth: `${props.maxWidth}px`
  })

  onMounted(() => {
    calcPosition(props.event!)
  })

  onUnmounted(() => {
    // nothing
  })

  /**
   * 计算菜单的显示位置
   *
   * @param event 鼠标事件对象
   */
  function calcPosition(event: MouseEvent) {
    if (props.layer === 0) {
      calcTopMenuPosition(event)
    } else {
      calcChildMenuPosition(event)
    }
  }

  /**
   * 计算最顶级菜单的显示位置(以菜单的左上角为中心点显示)
   *
   * @param event 鼠标事件对象
   */
  function calcTopMenuPosition(event: MouseEvent) {
    const { clientX, clientY } = event
    const $body = document.body
    const comWidth = comRef.value?.clientWidth || 0,
      comHeight = comRef.value?.clientHeight || 0
    const bodyWidth = $body.clientWidth,
      bodyHeight = $body.clientHeight

    let x = clientX,
      y = clientY

    // 计算横向是否超出
    if (x + comWidth >= bodyWidth) {
      x -= x + comWidth - bodyWidth + 5
    }

    // 计算竖向是否超出
    if (y + comHeight >= bodyHeight) {
      y -= y + comHeight - bodyHeight + 5
    }

    wrapperStyle.left = `${x}px`
    wrapperStyle.top = `${y}px`
  }

  /**
   * 计算子菜单的显示位置（在父菜单右侧或左侧显示）
   *
   * @param event 鼠标事件对象
   */
  function calcChildMenuPosition(event: any) {
    const { clientX, clientY, _parent } = event
    const body = document.body
    const bodyWidth = body.clientWidth,
      bodyHeight = body.clientHeight
    const parentWidth = _parent.clientWidth,
      parentHeight = _parent.clientHeight
    const comWidth = comRef.value?.clientWidth || 0,
      comHeight = comRef.value?.clientHeight || 0

    let x = clientX + parentWidth - 3,
      y = clientY - 7

    // 判断横向是否超出了屏幕边界
    if (x + comWidth >= bodyWidth && clientX - comWidth >= 0) {
      x = clientX - parentWidth
    }

    // 判断竖向是否超出了屏幕边界
    if (y + comHeight >= bodyHeight && clientY - comHeight >= 0) {
      y = clientY - comHeight + parentHeight + 7
    }

    wrapperStyle.left = `${x}px`
    wrapperStyle.top = `${y}px`
  }

  /**
   * 点击了菜单项
   *
   * @param item  当前菜单项
   * @param index 当前菜单项索引
   * @param e     鼠标事件对象
   */
  function onClickItem(item: MenuItem, index: number, e: MouseEvent) {
    if (e.button !== 0 || item.disabled) {
      return
    }

    // 点击含有子菜单的菜单项时，用户定义的onClick函数不触发
    if (isAllowAppendChild(item)) {
      appendChildMenuItem(item, e)
    } else {
      item.onClick && item.onClick(item, index)

      if (props.clickItemHide) {
        onClose()
      }
    }
  }

  /**
   * 点击了分割线
   */
  function onClickDivided() {
    // 什么也不做，就是为了阻止冒泡
  }

  /**
   * 插入子菜单
   *
   * @param item
   * @param e
   */
  function appendChildMenuItem(item: MenuItem, e: MouseEvent) {
    // 关闭同级菜单
    props.onClose(props.layer + 1)

    // @ts-ignore
    const path = e.path
    let parent = null
    if (path) {
      for (let i = 0; i < path.length; i++) {
        if (path[i].classList.contains('menu-item')) {
          parent = path[i] as HTMLElement
          break
        }
      }
    } else {
      let currentTarget = e.currentTarget as HTMLElement
      if (currentTarget.classList.contains('menu-item')) {
        parent = currentTarget
      }
    }

    const rect = parent?.getBoundingClientRect()
    ApContextmenu({
      ...props,
      // @ts-ignore
      menus: item.children,
      // @ts-ignore
      event: {
        clientX: rect?.left,
        clientY: rect?.top,
        _parent: parent
      } as MouseEvent,
      _repeat: true
    })
  }

  /**
   * 是否允许插入子菜单
   *
   * @param item 当前菜单项
   */
  function isAllowAppendChild(item: MenuItem) {
    return item.children && item.children.length > 0 && props.layer < maxItemLv
  }

  /**
   * 鼠标进入菜单项，如果有子菜单项就打开子菜单
   *
   * @param menu 鼠标移入到的菜单项
   * @param e    鼠标事件对象
   */
  function onMouseenterItem(menu: MenuItem, e: MouseEvent) {
    if (isAllowAppendChild(menu) && props.childTrigger === 'hover') {
      appendChildMenuItem(menu, e)
    } else {
      props.onClose(props.layer + 1)
    }
  }

  /**
   * 关闭菜单
   */
  function onClose() {
    const a = props.beforeClose && props.beforeClose()
    // 必须等于false的时候才终止关闭
    if (a === false) {
      return
    }

    props.onClose()
  }

  return {
    wrapperStyle,

    onClose,
    onClickDivided,
    onClickItem,
    onMouseenterItem,
    isAllowAppendChild
  }
}
