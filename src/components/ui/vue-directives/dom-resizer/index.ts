import type { CSSProperties, Directive, DirectiveBinding, VNode } from 'vue'
import { useEventListener } from '@vueuse/core'
import { ArrayUtils } from '@/common/utils/ArrayUtils'
import './index.scss'

/**
 * 手柄出现的位置
 */
export type ResizerHandPosition = 'top' | 'right' | 'bottom' | 'left'

export type ResizerProp = {
  /**
   * 手柄的位置
   */
  position: ResizerHandPosition | ResizerHandPosition[]

  /**
   * 手柄大小
   */
  handSize?: number

  /**
   * 最小宽度
   */
  minWidth?: number

  /**
   * 最大宽度
   */
  maxWidth?: number

  /**
   * 最小高度
   */
  minHeight?: number

  /**
   * 最大高度
   */
  maxHeight?: number

  /**
   * 是否隐藏手柄颜色
   */
  hideColor?: boolean

  /**
   * 当拖拽时是否修改被绑定指令dom的尺寸.
   *
   * - true: 当拖拽时修改绑定该指令的dom尺寸
   * - false: 不修改
   */
  isChangeSelf?: boolean

  /**
   * 当尺寸改变时的回调函数
   *
   * @param width  拖拽后的宽度, 当`isChangeSelf = false`时, 这个值是MouseEvent.movementX()
   * @param height 拖拽后的高度, 当`isChangeSelf = false`时, 这个值是MouseEvent.movementY()
   * @returns void
   */
  onChange?: (width: string, height: string) => void
}

const setDomStyle = (el: HTMLElement, styles: CSSProperties) => {
  for (const key in styles) {
    // @ts-ignore
    el.style[key] = styles[key]
  }
}

const domResizerDirective = {
  mounted: (el: HTMLElement, binding: DirectiveBinding<ResizerProp>, vnode: VNode) => {
    const props = binding.value || {}
    if (!props.handSize) {
      props.handSize = 3
    }

    // 校验props是否合法
    const { position } = window.getComputedStyle(el)
    if (!['fixed', 'absolute', 'relative', 'sticky'].includes(position)) {
      throw new Error('v-resizer must be used on a positioned element')
    }

    if (!props.position || (ArrayUtils.isArray(props.position) && props.position.length === 0)) {
      throw new Error('v-resizer must have a position')
    }

    if (!ArrayUtils.isArray(props.position)) {
      props.position = [props.position] as ResizerHandPosition[]
    }

    ;(props.position as ResizerHandPosition[]).forEach(position => {
      // 创建手柄
      const $div = document.createElement('div')
      $div.className = `dom-resizer-hand ${props.hideColor && 'is-hide-color'}`
      $div.dataset.position = position

      // #region 初始化手柄位置
      if (position === 'left' || position === 'right') {
        setDomStyle($div, {
          cursor: 'ew-resize',
          width: `${props.handSize}px`,
          height: '100%',
          top: '0'
        })
        if (position === 'left') {
          setDomStyle($div, { left: '0' })
        } else {
          setDomStyle($div, { right: '0' })
        }
      } else if (position === 'top' || position === 'bottom') {
        setDomStyle($div, {
          cursor: 'ns-resize',
          width: '100%',
          height: `${props.handSize}px`,
          left: '0'
        })
        if (position === 'top') {
          setDomStyle($div, { top: '0' })
        } else {
          setDomStyle($div, { bottom: '0' })
        }
      }
      // #endregion

      // #region 拖拽手柄修改绑定dom的size
      useEventListener($div, 'mousedown', e => {
        $div.classList.add('is-resize')
        const position = (e.target as HTMLElement)?.dataset.position as ResizerHandPosition

        const moveFun = (e2: MouseEvent) => {
          e2.preventDefault()
          
          if (props.isChangeSelf !== undefined && props.isChangeSelf === false) {
            props.onChange?.(`${e2.movementX}px`, `${e2.movementY}px`)
            return
          }
          if (position === 'right' || position === 'left') {
            const width = el.offsetWidth + e2.movementX
            if (props.minWidth && width <= props.minWidth) {
              return
            }
            if (props.maxWidth && width >= props.maxWidth) {
              return
            }
            el.style.width = `${width}px`
          } else if (position === 'top' || position === 'bottom') {
            const height = el.offsetHeight + e2.movementY
            if (props.minHeight && height <= props.minHeight) {
              return
            }
            if (props.maxHeight && height >= props.maxHeight) {
              return
            }
            el.style.height = `${height}px`
          }

          props.onChange?.(`${el.offsetWidth}px`, `${el.offsetHeight}px`)
        }

        const removeFun = () => {
          $div.classList.remove('is-resize')
          document.removeEventListener('mousemove', moveFun)
          document.removeEventListener('mouseup', removeFun)
        }

        document.addEventListener('mousemove', moveFun)
        document.addEventListener('mouseup', removeFun)
      })
      // #endregion

      el.appendChild($div)
    })
  }
} as Directive<HTMLElement, ResizerProp>

export const vResizer = domResizerDirective
export default vResizer
