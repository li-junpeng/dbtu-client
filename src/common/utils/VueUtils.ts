import { computed } from 'vue'

export const usePropValue = <T>(data: any, emits: (name: string, ...args: any[]) => void) => {
  return computed<T>({
    get: () => data,
    set: (val: T) => {
      emits('update:modelValue', val)
    }
  })
}
