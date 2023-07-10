import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { Message } from '@/components/element-plus/el-feedback-util'

export interface BasePropDefine<T extends BaseConnectionDetail> {
  modelValue: ConnectionInfo<T>
}

interface Options {

  /**
   * 初始化表单数据所使用的执行函数, 需要实现该函数来初始化表单数据
   */
  initFormData?: () => void

  /**
   * 测试连接之前, 返回false将不执行测试连接操作。测试连接之前, 返回false将不执行测试连接操作。
   */
  beforeTestConnection?: () => boolean | void

  /**
   * 测试连接执行之后
   *
   * @param success  true: 执行成功, false: 执行失败
   * @param msg      消息内容
   */
  afterTestConnection?: (success: boolean, msg?: string) => void

}

export const useCommonForm = <T extends BaseConnectionDetail>(
  props: BasePropDefine<T>,
  formData: Ref<ConnectionInfo<T>>,
  options?: Options
) => {
  /**
   * 表单数据是否初始化完成标识
   */
  const dataInitCompleted = ref(false)

  // 初始化表单数据
  onMounted(async () => {
    if (options && options.initFormData) {
      await options.initFormData()
    }

    dataInitCompleted.value = true
  })

  // region 测试连接 start //
  const isTestConnecting = ref(false)
  const onTestConnection = () => {
    if (options?.beforeTestConnection) {
      const b = options?.beforeTestConnection()
      if (b === false) {
        return
      }
    }

    isTestConnecting.value = true

    // TODO 这里先模拟，调用测试连接地址
    setTimeout(() => {
      console.log(formData.value)
      isTestConnecting.value = false
      Message.success('数据库连接成功')

      options?.afterTestConnection?.(true)
    }, 2000)
  }
  // endregion 测试连接 end //

  return {
    dataInitCompleted,

    isTestConnecting,
    onTestConnection
  }
}
