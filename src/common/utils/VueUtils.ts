import { computed } from 'vue'
import type { WritableComputedRef } from 'vue'

export const usePropValue = <T>(
  data: any,
  emits: (name: any, ...args: any[]) => void
): WritableComputedRef<T> => {
  return computed<T>({
    get: () => data,
    set: (val: T) => {
      emits('update:modelValue', val)
    }
  })
}
