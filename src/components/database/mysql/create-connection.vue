<!--
 * 创建MySQL连接
 *
 * @author Junpeng.Li
 * @date 2023-07-03 23:
-->
<script setup lang="ts">
import { onMounted } from 'vue'
import { ElFormItem, ElInput } from 'element-plus'
import { NumberUtils } from '@/common/utils/NumberUtils'
import CommonForm from '@/components/database/component/create-connection/common-form.vue'
import { useCommonForm } from '@/components/database/component/create-connection/common-form'

defineOptions({
  name: 'CreateMySQLConnectionForm'
})

const props = defineProps<{
  modelValue: ConnectionInfo<MySQLConnectionInfo>
}>()

const emits = defineEmits(['update:modelValue'])

const { formData } = useCommonForm(props.modelValue, emits)

const initFormData = () => {
  if (NumberUtils.isEmpty(formData.value.port)) {
    formData.value.port = 3306
  }
  if (!formData.value.detail) {
    formData.value.detail = {
      username: 'root'
    }
  }
}

onMounted(() => {
  initFormData()
})
</script>

<template>
  <common-form v-model="formData">
    <el-form-item label="主机" prop="host">
      <el-input v-model="formData.host"/>
    </el-form-item>
  </common-form>
</template>

<style scoped lang="scss">

</style>
