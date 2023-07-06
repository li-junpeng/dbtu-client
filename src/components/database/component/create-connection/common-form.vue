<!--
 * 通用的创建连接表单
 *
 * @author Junpeng.Li
 * @date 2023-07-04 21:
-->
<script setup lang="ts">
import { ElButton, ElForm, ElFormItem, ElInput } from 'element-plus'
import { PropType } from 'vue'
import { usePropValue } from '@/common/utils/VueUtils'
import { useCommonForm } from '@/components/database/component/create-connection/common-form'
import { useComponentRef } from '@/components/element-plus/elemenet-plus-util'

defineOptions({
  name: 'CreateConnectionFormCommonHeaderComponent'
})

const props = defineProps({
  modelValue: {
    type: Object as PropType<ConnectionInfo<BaseConnectionDetail>>,
    required: true
  },
  labelWidth: {
    type: String,
    default: '80px'
  },
  rules: {
    type: Object as PropType<any>
  }
})

const emits = defineEmits(['update:modelValue'])

const formData = usePropValue<ConnectionInfo<BaseConnectionDetail>>(props.modelValue, emits)

const {
  isTestConnecting,
  onTestConnection
} = useCommonForm(formData)

const formRef = useComponentRef(ElForm)

defineExpose({
  formRef
})
</script>

<template>
  <div class="form-container">
    <div class="form-main">
      <el-form
        ref="formRef"
        v-model="formData"
        :label-width="labelWidth!"
        :rules="rules"
        label-position="left"
      >
        <el-form-item label="连接名" prop="name">
          <el-input
            v-model="formData.name"
          />
        </el-form-item>
        <el-form-item label="说明" prop="comment">
          <el-input
            v-model="formData.comment"
            type="textarea"
            :autosize="{
              minRows: 1,
              maxRows: 6
            }"
            resize="none"
          />
        </el-form-item>
        <slot>
          <h2 class="illegal-slot-text">不合法的表单内容</h2>
        </slot>
      </el-form>
    </div>

    <div class="form-footer">
      <el-button link @click="onTestConnection" :loading="isTestConnecting">测试连接</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.form-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .form-main {
    flex: 1;
    overflow: auto;
  }

  .illegal-slot-text {
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: red;
    font-size: 20px;
  }

  .form-footer {
    width: 100%;
    height: 22px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
}
</style>
