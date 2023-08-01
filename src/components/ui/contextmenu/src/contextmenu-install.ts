import { type App, type ComponentPublicInstance, createApp } from 'vue'
import ContextMenu from './contextmenu.vue'
import { type ContextmenuOption } from './constants'

let apps: App[] = [],
  $divs: HTMLDivElement[] = []

/**
 * 卸载组件
 *
 * @param index 卸载指定的app，为空时则卸载全部
 */
function uninstall(index?: number) {
  if (index == undefined) {
    for (let i = apps.length - 1; i >= 0; i--) {
      uninstall(i)
    }

    unRegisterEvent()
  } else {
    for (let i = apps.length - 1; i >= index; i--) {
      if (apps[i]) {
        apps[i].unmount()
        apps.splice(i, 1)
      }

      if ($divs[i]) {
        $divs[i].remove()
        $divs.splice(i, 1)
      }
    }
  }
}

/**
 * 创建用来装载组件的element
 *
 * @param target {@link ContextMenuOption.container}
 */
function createElement(target?: string | HTMLElement): HTMLDivElement {
  const $div = document.createElement('div')

  if (!target) {
    document.body.appendChild($div)
  } else if (typeof target === 'object') {
    target.appendChild($div)
  } else {
    const $container = document.querySelector(target)
    return createElement($container as HTMLElement)
  }

  return $div
}

/**
 * 点击除自身组件以外页面任意位置
 */
function onWindowClick() {
  uninstall()
}

/**
 * 注册事件
 */
let isRegisterClick = false

function registerEvent() {
  if (!isRegisterClick) {
    setTimeout(() => {
      window.addEventListener('mousedown', onWindowClick, false)
      isRegisterClick = true
    }, 300)
  }
}

/**
 * 销毁事件
 */
function unRegisterEvent() {
  window.removeEventListener('mousedown', onWindowClick, false)
  isRegisterClick = false
}

/**
 * 安装组件
 *
 * @param options 组件配置项
 */
export function ApContextmenu(options: ContextmenuOption): ComponentPublicInstance {
  if (!options._repeat) {
    uninstall()
  }

  const $div = createElement(options.target)
  $divs.push($div)

  const app = createApp(ContextMenu, {
    ...options,
    layer: $divs.length - 1,
    onClose(layer?: number) {
      uninstall(layer)
    }
  })
  apps.push(app)

  registerEvent()

  return app.mount($div)
}

export default ApContextmenu
