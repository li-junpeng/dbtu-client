<!--
 * 创建MySQL连接
 *
 * @author Junpeng.Li
 * @date 2023-07-03 23:
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElFormItem, ElInput, ElInputNumber, ElRow, ElCol, ElTabs, ElTabPane, ElSelect, ElOption } from 'element-plus'
import { NumberUtils } from '@/common/utils/NumberUtils'
import CommonForm from '@/components/database/component/create-connection/common-form.vue'
import { usePropValue } from '@/common/utils/VueUtils'
import { AuthenticationTypes } from '@/common/constants/ConnectionConstant'
import { ObjectUtils } from '@/common/utils/ObjectUtils'
import { useCommonForm } from '@/components/database/component/create-connection/common-form'

defineOptions({
  name: 'CreateMySQLConnectionForm'
})

const props = defineProps<{
  modelValue: ConnectionInfo<MySQLConnectionInfo>
}>()

const emits = defineEmits(['update:modelValue'])

const formData = usePropValue<ConnectionInfo<MySQLConnectionInfo>>(props.modelValue, emits)
const {
  dataInitCompleted
} = useCommonForm(formData, {
  initFormData: () => {
    if (NumberUtils.isEmpty(formData.value.port)) {
      formData.value.port = 3306
    }
    if (ObjectUtils.isEmpty(formData.value.detail)) {
      formData.value.detail = {
        username: 'root',
        authType: 'user_password'
      }
    }
  }
})

const activeTab = ref('general')
</script>

<template>
  <common-form
    v-if="dataInitCompleted"
    v-model="formData"
  >
    <el-tabs
      v-model="activeTab"
      style="--el-tab-pane-width: 100px;"
    >
      <el-tab-pane name="general" label="常规">
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
        <el-row>
          <el-col :span="13">
            <el-form-item label="认证方式" prop="authType">
              <el-select
                v-model="formData.detail.authType"
                style="width: 100%"
              >
                <el-option
                  v-for="item in AuthenticationTypes"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane name="ssh_ssl" label="SSH/SSL">

      </el-tab-pane>
    </el-tabs>
  </common-form>
</template>

<style scoped lang="scss">

</style>
