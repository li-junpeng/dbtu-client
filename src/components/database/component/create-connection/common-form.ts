import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { Message, MessageBox } from '@/components/element-plus/el-feedback-util'
import { testConnection } from '@/api/connection-api'

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
  const onTestConnection = async () => {
    if (options?.beforeTestConnection) {
      const b = options?.beforeTestConnection()
      if (b === false) {
        return
      }
    }

    isTestConnecting.value = true
    const { status, message } = await testConnection(formData.value)
    if (status === 'success') {
      Message.success(message)
    } else {
      MessageBox.error(message)
    }
    isTestConnecting.value = false
    options?.afterTestConnection?.(status === 'success', message)
  }
  // endregion 测试连接 end //

  return {
    dataInitCompleted,

    isTestConnecting,
    onTestConnection
  }
}
