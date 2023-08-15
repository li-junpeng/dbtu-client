<!--
 * 创建分组
 *
 * @author Junpeng.Li
 * @date 2023-07-14 17-06
-->
<script setup lang="ts">
import { useConnectionStore } from '@/stores/ConnectionStore'
import PromptDialog, { type PromptDialogInstance } from '@/components/ui/prompt-dialog'

defineOptions({
  name: 'CreateGroupComponent'
})

const emits = defineEmits<{
  (e: 'submit-success', data: ConnectionGroup): void
}>()

const renameDialogRef = ref<PromptDialogInstance>()

const connectionStore = useConnectionStore()
const dialog = reactive({
  isEdit: false
})

const formData = ref<ConnectionGroup>({
  id: null,
  name: '',
  nodeType: 'group'
})

const formRules = {
  required: true,
  trigger: 'blur',
  message: '分组名称为必填项'
}

const open = (data?: ConnectionGroup) => {
  if (data) {
    dialog.isEdit = true
    formData.value = JSON.parse(JSON.stringify(data))
    renameDialogRef.value?.open(formData.value.name)
  } else {
    dialog.isEdit = false
    formData.value = {
      id: null,
      name: 'New Group',
      nodeType: 'group'
    }
    renameDialogRef.value?.open('New Group')
  }
}

const onConfirm = async (name: string): Promise<string> => {
  formData.value.name = name

  const fn = dialog.isEdit ? connectionStore.updateGroupById : connectionStore.createGroup
  const { status, message } = await fn(formData.value)
  if (status === 'success') {
    emits('submit-success', formData.value)
    return Promise.resolve(message)
  } else {
    return Promise.reject(message)
  }
}

defineExpose({
  open
})
</script>

<template>
  <PromptDialog
    ref="renameDialogRef"
    :title="dialog.isEdit ? '重命名' : '创建分组'"
    :validate-rule="formRules"
    :confirm="onConfirm"
    :confirm-text="dialog.isEdit ? '保存' : '创建'"
    label="分组名"
  />
</template>