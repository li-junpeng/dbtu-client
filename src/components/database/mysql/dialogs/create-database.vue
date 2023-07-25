<!--
 * 新建/编辑数据库
 *
 * @author Junpeng.Li
 * @date 2023-07-24 14-39
-->
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElForm, ElFormItem, ElInput, ElOption, ElSelect, ElTabPane, ElTabs } from 'element-plus'
import CharacterAndCollate from '@/assets/data/mysql-character-collate.json'
import { StringUtils } from '@/common/utils/StringUtils'
import { useComponentRef } from '@/components/element-plus/elemenet-plus-util'
import MonacoEditor from '@/components/ui/monaco-editor/index.vue'

defineOptions({
  name: 'MySQLCreateDatabaseDialog'
})

const activeTab = ref('default')
const formData = reactive<Optional<MySqlDatabaseNode, 'id' | 'status'>>({
  name: '',
  nodeType: 'database',
  character: '',
  collate: ''
})
const formRules = {
  name: [
    {
      // @ts-ignore
      validator: (a, b, callback) => {
        if (StringUtils.isEmpty(formData.name)) {
          return callback('数据库名称为必填项')
        }
        callback()
      },
      trigger: 'blur'
    }
  ]
}
const formRef = useComponentRef(ElForm)
const sql = ref('')
const characters = Object.keys(CharacterAndCollate)
const collates = computed(() => {
  return (CharacterAndCollate as Record<string, string[]>)[formData.character]?.sort() || []
})

watch(() => formData.character, () => {
  formData.collate = ''
})

// 根据表单内容生成sql预览
watch(() => formData, () => {
  let str = 'CREATE DATABASE '
  // name
  str += `\`${formData.name}\``
  // 字符集
  str += formData.character ? ` CHARACTER SET '${formData.character}'` : ''
  // 排序规则
  str += formData.collate ? ` COLLATE '${formData.collate}'` : ''
  sql.value = str + ';'
}, { deep: true })

const onSubmit = (): Promise<MySqlDatabaseNode> => {
  return new Promise((resolve, reject) => {
    formRef.value?.validate(async valid => {
      if (!valid) {
        reject()
        return
      }
      resolve({
        ...formData,
        id: Date.now(),
        status: 'disable'
      })
    })
  })
}

defineExpose({
  onSubmit
})

</script>

<template>
  <div style="width: 100%;height: 300px;">
    <el-tabs
      v-model="activeTab"
      style="--el-tab-pane-width: 90px"
    >
      <el-tab-pane label="常规" name="default">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="数据库名" prop="name">
            <el-input v-model="formData.name" :maxlength="40"/>
          </el-form-item>
          <el-form-item label="字符集">
            <el-select
              v-model="formData.character"
              style="width: 100%"
              clearable
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
          <el-form-item label="排序规则">
            <el-select
              v-model="formData.collate"
              style="width: 100%"
              clearable
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
      <el-tab-pane label="SQL 预览" name="sql_preview">
        <div style="width: 560px;height: 250px;">
          <monaco-editor
            v-model="sql"
            readonly
            line-numbers="off"
            word-wrap="on"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">

</style>
