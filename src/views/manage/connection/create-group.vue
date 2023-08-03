<!--
 * 创建分组
 *
 * @author Junpeng.Li
 * @date 2023-07-14 17-06
-->
<script setup lang="ts">
import { StringUtils } from '@/common/utils/StringUtils'
import { useComponentRef } from '@/components/element-plus/element-plus-util'
import { useConnectionStore } from '@/stores/ConnectionStore'
import { Message } from '@/components/element-plus/el-feedback-util'
import { MessageBox } from '@element-plus/icons-vue'

defineOptions({
  name: 'CreateGroupComponent'
})

const emits = defineEmits<{
  (e: 'submit-success', data: ConnectionGroup): void
}>()

const connectionStore = useConnectionStore()
const formRef = useComponentRef(ElForm)
const dialog = reactive({
  visible: false,
  title: '创建分组',
  isEdit: false
})
const formData = ref<ConnectionGroup>({
  id: null,
  name: '',
  nodeType: 'group'
})
const formRules = {
  name: [
    {
      trigger: 'blur',
      validator: (a: any, b: any, callback: Function) => {
        if (StringUtils.isEmpty(formData.value.name)) {
          throw new Error('分组名称为必填项')
        }
        callback()
      }
    }
  ]
}

const open = (data?: ConnectionGroup) => {
  if (data) {
    dialog.isEdit = true
    dialog.title = '编辑分组'
    formData.value = JSON.parse(JSON.stringify(data))
  } else {
    dialog.isEdit = false
    dialog.title = '创建分组'
    formData.value = {
      id: null,
      name: 'New Group',
      nodeType: 'group'
    }
  }

  dialog.visible = true
}

const onCancel = () => {
  dialog.visible = false
}

const isSaving = ref(false)
const submitBtnText = computed(() => {
  return isSaving.value ? '正在保存' : dialog.isEdit ? '保存' : '创建'
})
const onConfirm = () => {
  formRef.value?.validate(async valid => {
    if (!valid) {
      return
    }

    isSaving.value = true
    const fn = dialog.isEdit ? connectionStore.updateGroupById : connectionStore.createGroup
    const { status, message } = await fn(formData.value)
    if (status === 'success') {
      dialog.visible = false
      Message.success(message)
      emits('submit-success', formData.value)
    } else {
      MessageBox.error(message)
    }
    isSaving.value = false
  })
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialog.visible"
    :title="dialog.title"
    width="500px"
    :close-on-click-modal="false"
    destroy-on-close
    draggable
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="90px"
      label-position="left"
    >
      <el-form-item
        label="分组名称"
        prop="name"
      >
        <el-input
          v-model="formData.name"
          maxlength="40"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button
        type="info"
        @click="onCancel"
        >取消</el-button
      >
      <el-button
        type="primary"
        @click="onConfirm"
        :loading="isSaving"
        >{{ submitBtnText }}</el-button
      >
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
@/components/element-plus/element-plus-util