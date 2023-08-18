<!--
 * 新建/编辑数据库
 *
 * @author Junpeng.Li
 * @date 2023-07-24 14-39
-->
<script setup lang="ts">
import type { FormRules } from 'element-plus'
import CharacterAndCollate from '@/assets/data/mysql-character-collate.json'
import { StringUtils } from '@/common/utils/StringUtils'
import { useComponentRef } from '@/components/element-plus/element-plus-util'
import SqlCodePreview from '@/components/ui/sql-code-preview/index.vue'
import type { PropType } from 'vue'
import { createDatabase, alterDatabase } from '@/api/database/mysql-database-api'
import { Message, MessageBox } from '@/components/element-plus/el-feedback-util'

defineOptions({
  name: 'MySQLCreateDatabaseDialog'
})

const props = defineProps({
  connection: {
    type: Object as PropType<ConnectionInfo<MySQLConnectionInfo>>,
    required: true
  }
})

const activeTab = ref('default')
const isEdit = ref(false)
const formData = ref<Optional<MySqlDatabaseInstance, 'id' | 'status'>>({
  name: '',
  nodeType: 'database',
  character: '',
  collate: ''
})
const formRules: FormRules = {
  name: [
    {
      validator: (a, b, callback) => {
        if (StringUtils.isEmpty(formData.value.name)) {
          return callback('数据库名称为必填项')
        }
        callback()
      },
      trigger: 'blur'
    }
  ],
  character: [{ required: true, message: '请选择字符集' }],
  collate: [{ required: true, message: '请选择排序规则' }]
}
const formRef = useComponentRef(ElForm)
const sql = ref('')
const characters = Object.keys(CharacterAndCollate)
const collates = computed(() => {
  return (CharacterAndCollate as Record<string, string[]>)[formData.value.character]?.sort() || []
})
const isNoWatch = ref(false)

watch(
  () => formData.value.character,
  () => {
    if (isNoWatch.value) {
      return
    }
    formData.value.collate = ''
  }
)

// 根据表单内容生成sql预览
watch(
  () => formData.value,
  () => {
    if (isNoWatch.value) {
      return
    }

    const { name, character, collate } = formData.value
    let str = ''
    if (isEdit.value) {
      str += character ? ` CHARACTER SET '${character}'` : ''
      str += collate ? ` COLLATE '${collate}'` : ''
      if (str) {
        str = `ALTER DATABASE \`${name}\`` + str
      }
    } else {
      str = `CREATE DATABASE \`${name}\``
      str += character ? ` CHARACTER SET '${character}'` : ''
      str += collate ? ` COLLATE '${collate}'` : ''
    }
    sql.value = str ? str + ';' : ''
  },
  { deep: true }
)

const onSubmit = (): Promise<MySqlDatabaseInstance> => {
  return new Promise((resolve, reject) => {
    formRef.value?.validate(async valid => {
      if (!valid) {
        reject()
        return
      }
      if (isEdit.value) {
        const { status, message } = await alterDatabase(formData.value as MySqlDatabaseInstance)
        if (status === 'success') {
          Message.success(message)
          resolve(formData.value as MySqlDatabaseInstance)
        } else {
          MessageBox.error(message)
          reject(message)
        }
      } else {
        formData.value.sessionId = props.connection.sessionId
        const { status, message, data } = await createDatabase(formData.value as MySqlDatabaseInstance)
        if (status === 'success') {
          Message.success(message)
          resolve(data!)
        } else {
          MessageBox.error(message)
          reject(message)
        }
      }
    })
  })
}

const setFormData = (data: MySqlDatabaseInstance) => {
  isEdit.value = true
  isNoWatch.value = true
  formData.value = JSON.parse(JSON.stringify(data))
  nextTick(() => (isNoWatch.value = false))
}

defineExpose({
  onSubmit,
  setFormData
})
</script>

<template>
  <div style="width: 100%; height: 300px">
    <el-tabs
      v-model="activeTab"
      style="--el-tab-pane-width: 90px"
    >
      <el-tab-pane
        label="常规"
        name="default"
      >
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
          label-position="left"
          class="hide-required-label"
        >
          <el-form-item
            label="数据库名"
            prop="name"
          >
            <el-input
              v-model="formData.name"
              :maxlength="40"
              :disabled="isEdit"
            />
          </el-form-item>
          <el-form-item
            label="字符集"
            prop="character"
          >
            <el-select
              v-model="formData.character"
              style="width: 100%"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in characters"
                :key="item"
                :value="item"
                :label="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="排序规则"
            prop="collate"
          >
            <el-select
              v-model="formData.collate"
              style="width: 100%"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in collates"
                :key="item"
                :value="item"
                :label="item"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        label="SQL 预览"
        name="sql_preview"
      >
        <div style="width: 560px; height: 250px">
          <sql-code-preview :code="sql" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss"></style>
