import { ref } from 'vue'
import { Message } from '@/components/element-plus/el-feedback-util'

export const useCommonForm = () => {

  // region 测试连接 start //
  const isTestConnecting = ref(false)
  const onTestConnection = () => {
    isTestConnecting.value = true

    // TODO 这里先模拟，调用测试连接地址
    setTimeout(() => {
      isTestConnecting.value = false
      Message.success('数据库连接成功')
    }, 2000)
  }
  // endregion 测试连接 end //

  return {
    isTestConnecting,
    onTestConnection
  }
}
