import { computed } from 'vue'
import { usePropValue } from '@/common/utils/VueUtils'

export const useCommonForm = <T extends BaseConnectionDetail>(
  data: ConnectionInfo<T>,
  emits: (name: string, ...args: any[]) => void
) => {
  const formData = usePropValue<ConnectionInfo<T>>(data, emits)
  return {
    formData
  }
}
