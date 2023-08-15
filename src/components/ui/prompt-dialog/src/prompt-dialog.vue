<!--
 * 提交内容对话框通用组件
 *
 * @author HuaYu
 * @date 2023-08-15 11:56
-->
<script setup lang="ts">
import { useComponentRef } from '@/components/element-plus/element-plus-util'
import { type PromptDialogProp } from './prompt-dialog'
import { Message, MessageBox } from '@/components/element-plus/el-feedback-util'

defineOptions({
  name: 'PromptDialogComponent'
})

const props = withDefaults(defineProps<PromptDialogProp>(), {
  title: '请输入内容',
  width: '500px',
  label: '名称',
  confirmText: '保存',
  confirmLoadingText: '正在保存'
})

const formRef = useComponentRef(ElForm)

const dialog = reactive({
  visible: false,
  loading: false
})

const formData = reactive({
  name: ''
})

const formRules = {
  name: props.validateRule
}

const open = (name: string = '') => {
  formData.name = name
  dialog.visible = true
}

const handleCancel = () => {
  dialog.visible = false
  props.afterCancel?.()
}

const handleConfirm = () => {
  formRef.value?.validate(async result => {
    if (!result) return

    dialog.loading = true
    try {
      const message = await props.confirm(formData.name)
      Message.success(message || '保存成功')
      dialog.visible = false
    } catch (e) {
      MessageBox.error((e as string) || '保存失败。')
    } finally {
      dialog.loading = false
    }
  })
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialog.visible"
    :title="props.title"
    :width="props.width"
    draggable
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="80px"
      label-position="left"
      class="hide-required-label"
      scroll-to-error
      @submit.prevent
    >
      <el-form-item
        :label="props.label"
        prop="name"
      >
        <el-input
          v-model="formData.name"
          v-bind="props.inputProp"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button
        type="info"
        @click="handleCancel"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        @click="handleConfirm"
        :loading="dialog.loading"
      >
        {{ dialog.loading ? props.confirmLoadingText : props.confirmText }}
      </el-button>
    </template>
  </el-dialog>
</template>