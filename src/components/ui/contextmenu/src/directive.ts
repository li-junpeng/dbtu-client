import type { Directive } from 'vue'
import type { DirectiveBinding } from '@vue/runtime-core'

import { ApContextmenu } from './contextmenu-install'
import type { ContextmenuOption } from './constants'

const openMenu = (e: MouseEvent, options: ContextmenuOption) => {
  e.preventDefault()

  ApContextmenu({
    ...options,
    event: e
  })
}

export const contextmenuDirective: Directive = {
  mounted: (el: HTMLElement, binding: DirectiveBinding<ContextmenuOption>) => {
    el.addEventListener('contextmenu', e => openMenu(e, binding.value), false)
  },

  unmounted: (el: HTMLElement, binding: DirectiveBinding<ContextmenuOption>) => {
    el.removeEventListener('contextmenu', e => openMenu(e, binding.value), false)
  }
}
