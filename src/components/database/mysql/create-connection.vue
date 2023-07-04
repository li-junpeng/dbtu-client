<!--
 * 创建MySQL连接
 *
 * @author Junpeng.Li
 * @date 2023-07-03 23:
-->
<script setup lang="ts">
import { onMounted } from 'vue'
import { ElFormItem, ElInput, ElInputNumber, ElRow, ElCol } from 'element-plus'
import { NumberUtils } from '@/common/utils/NumberUtils'
import CommonForm from '@/components/database/component/create-connection/common-form.vue'
import { usePropValue } from '@/common/utils/VueUtils'

defineOptions({
  name: 'CreateMySQLConnectionForm'
})

const props = defineProps<{
  modelValue: ConnectionInfo<MySQLConnectionInfo>
}>()

const emits = defineEmits(['update:modelValue'])

const formData = usePropValue<ConnectionInfo<MySQLConnectionInfo>>(props.modelValue, emits)

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
    <el-row>
      <el-col :span="13">
        <el-form-item label="主机" prop="host">
          <el-input v-model="formData.host"/>
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="端口" prop="port">
          <el-input-number v-model="formData.port" :controls="false" class="el-input-number__text-left" style="width: 100%"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="认证方式" prop="">
      <el-input/>
    </el-form-item>
  </common-form>
</template>

<style scoped lang="scss">

</style>
