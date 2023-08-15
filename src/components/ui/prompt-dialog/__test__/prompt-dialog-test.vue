<!--
 * 重命名对话框组件
 *
 * @author HuaYu
 * @date 2023-08-15 13:45
-->
<script setup lang="ts">
import PromptDialog, { type PromptDialogInstance } from '@/components/ui/prompt-dialog'

defineOptions({
  name: 'RenameDialogTest'
})

const renameDialogRef = ref<PromptDialogInstance>()

const openDialog = () => {
  renameDialogRef.value?.open('sys_user')
}

const nameRule = [
  { required: true, trigger: 'blur', message: '名称为必填项'},
  { min: 1, max: 10, trigger: 'blur', message: '只允许输入 1 ~  10 个字符'}
]

const handleCancel = () => {
  alert('关闭了')
}

const onSave = (name: string): Promise<string> => {
  // return Promise.resolve()
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('模仿接口请求成功: ' + name)
      // reject('模仿接口请求错误')
    }, 1000)
  })
}
</script>

<template>
  <el-button
    @click="openDialog"
    style="margin: 100px"
    type="primary"
  >
    打开
  </el-button>

  <PromptDialog
    ref="renameDialogRef"
    :validate-rule="nameRule"
    :after-cancel="handleCancel"
    :confirm="onSave"
    :input-prop="{
      maxlength: 5,
      clearable: true
    }"
  />
</template>

<style scoped lang="scss"></style>
