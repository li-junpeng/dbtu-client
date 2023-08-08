import { markRaw, type AsyncComponentLoader } from 'vue'
import Loading from '@/components/ui/loading/index.vue'
import ErrorPage from '@/components/ui/error-page/async-error.vue'

export const loadAsyncComponent = (loader: AsyncComponentLoader<any>, isMarkRaw: boolean = false) => {
  const component = defineAsyncComponent({
    loader: loader,
    loadingComponent: Loading,
    delay: 200,
    errorComponent: ErrorPage,
    timeout: 10000
  })
  return isMarkRaw ? markRaw(component) : component
}