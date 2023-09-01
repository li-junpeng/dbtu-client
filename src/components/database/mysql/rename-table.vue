<!--
 * 重命名表名
 *
 * @author HuaYu
 * @date 2023-09-01 17:07
-->
<script setup lang="ts">
import { useComponentRef } from '@/components/element-plus/element-plus-util'
import { renameTable } from '@/api/database/mysql-database-api'
import { Message } from '@/components/element-plus/el-feedback-util'

defineOptions({
  name: 'RenameTableForm'
})

const props = defineProps<{
  tableInfo: MySqlTableInstance
}>()

const formData = reactive({
  newName: ''
})
const formRules = {
  newName: [{ required: true, trigger: 'blur', message: '表名为必填项' }]
}
const formRef = useComponentRef(ElForm)

const onSubmit = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    formRef.value?.validate(async isPass => {
      if (!isPass) {
        resolve(false)
        return
      }

      const { sessionId, database, name } = props.tableInfo
      const { status, message } = await renameTable(sessionId!, database, name, formData.newName)
      if (status === 'success') {
        Message.success(message)
        resolve(true)
      } else {
        reject(message)
      }
    })
  })
}

onMounted(() => {
  formData.newName = props.tableInfo.name
})

defineExpose({
  onSubmit
})
</script>

<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-width="80px"
    label-position="left"
    class="hide-required-label"
  >
    <el-form-item
      label="表名"
      prop="newName"
    >
      <el-input
        v-model="formData.newName"
        autofocus
      />
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
