import { ArrayUtils } from '@/common/utils/ArrayUtils'
import type { CSSProperties, DirectiveBinding, VNode } from 'vue'
import './index.scss'

export type ResizerPosition = 'top' | 'right' | 'bottom' | 'left'

export type ResizerProp = {
  position: ResizerPosition | ResizerPosition[]

  lineSize?: number

  minWidth?: number

  maxWidth?: number

  minHeight?: number

  maxHeight?: number
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
    if (!props.lineSize) {
      props.lineSize = 3
    }

    const { position } = window.getComputedStyle(el)
    if (!['fixed', 'absolute', 'relative', 'sticky'].includes(position)) {
      throw new Error('v-resizer must be used on a positioned element')
    }

    if (!props.position || (ArrayUtils.isArray(props.position) && props.position.length === 0)) {
      throw new Error('v-resizer must have a position')
    }

    if (!ArrayUtils.isArray(props.position)) {
      props.position = [props.position] as ResizerPosition[]
    }

    ;(props.position as ResizerPosition[]).forEach(position => {
      const $div = document.createElement('div')
      $div.className = 'dbtu-dom-resizer'
      $div.dataset.position = position
      if (position === 'left' || position === 'right') {
        setDomStyle($div, {
          cursor: 'ew-resize',
          width: `${props.lineSize}px`,
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
          height: `${props.lineSize}px`,
          left: '0'
        })
        if (position === 'top') {
          setDomStyle($div, { top: '0' })
        } else {
          setDomStyle($div, { bottom: '0' })
        }
      }

      // TODO 在组件卸载的时候记得清掉这个事件监听
      $div.addEventListener('mousedown', e => {
        const position = (e.target as HTMLElement)?.dataset.position as ResizerPosition

        const moveFun = (e2: MouseEvent) => {
          e2.preventDefault()

          if (position === 'right' || position === 'left') {
            const width = el.offsetWidth + e2.movementX
            if (props.minWidth && width <= props.minWidth) {
              return
            }
            if (props.maxWidth && width >= props.maxWidth) {
              return
            }
            el.style.width = `${width}px`
          }
        }

        const removeFun = () => {
          document.removeEventListener('mousemove', moveFun)
          document.removeEventListener('mouseup', removeFun)
        }

        document.addEventListener('mousemove', moveFun)
        document.addEventListener('mouseup', removeFun)
      })

      el.appendChild($div)
    })
  }
}

export const vResizer = domResizerDirective
export default vResizer
