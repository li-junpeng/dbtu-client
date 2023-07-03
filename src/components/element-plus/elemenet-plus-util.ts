import { ref } from 'vue'

/**
 * 获取element-plus组件的ref，此函数用来封装以下代码:
 * ``` javascript
 *  <script setup lang="ts">
 *  import { ElForm } from 'element-plus'
 *
 *  const formRef = ref<InstanceType<typeof ElForm> | null>(null)
 *  formRef.value?.validate(() => {
 *    // ......
 *  })
 *  </script>
 *
 *  <template>
 *    <el-form ref="formRef">
 *       ......
 *    </el-form>
 *  </template>
 * ```
 *
 * 参考抖音：https://www.douyin.com/video/7251216368719220023
 *
 * @param _com 组件类型, 目的是利用ts自动推导类型，来省略typeof关键字
 */
export const useComponentRef = <T extends abstract new (...args: any) => any>(_com: T) => {
  return ref<InstanceType<T>>()
}
