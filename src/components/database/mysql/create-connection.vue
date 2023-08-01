<!--
 * 创建MySQL连接
 *
 * @author Junpeng.Li
 * @date 2023-07-03 23:
-->
<script setup lang="ts">
import type { FormRules } from 'element-plus'
import { NumberUtils } from '@/common/utils/NumberUtils'
import CommonForm from '@/components/database/component/create-connection/common-form.vue'
import { usePropValue } from '@/common/utils/VueUtils'
import {
  AuthenticationTypes,
  ConnectionTypes,
  DatabaseDrivers,
  SavePasswordTypes,
  getDatabaseDriverInfo,
  CharsetTypes
} from '@/common/constants/ConnectionConstant'
import { ObjectUtils } from '@/common/utils/ObjectUtils'
import type { BasePropDefine } from '@/components/database/component/create-connection/common-form'
import { useCommonForm } from '@/components/database/component/create-connection/common-form'
import TimeZones from '@/assets/data/time-zone.json'

defineOptions({
  name: 'CreateMySQLConnectionForm'
})

const props = defineProps<BasePropDefine<MySQLConnectionInfo>>()

const emits = defineEmits(['update:modelValue'])

const commonFormRef = ref<InstanceType<typeof CommonForm> | null>(null)
const formData = usePropValue<ConnectionInfo<MySQLConnectionInfo>>(props.modelValue, emits)
const { dataInitCompleted } = useCommonForm(props, formData, {
  initFormData: () => {
    if (NumberUtils.isEmpty(formData.value.port)) {
      formData.value.port = 3306
    }
    if (ObjectUtils.isEmpty(formData.value.detail)) {
      formData.value.detail = {
        driver: 'mysql',
        connectionType: 'default',
        username: 'root',
        authType: 'user_password',
        savePwdType: 'forever',
        url: 'jdbc:mysql://localhost:3306',
        timeZone: 'Asia/Shanghai',
        charset: 'auto',
        connectionInterval: false,
        connectionIntervalTime: 60,
        autoBreak: false,
        autoBreakTime: 300
      }
    }
  }
})
const formRules: FormRules = {
  ['detail.url']: [
    {
      trigger: 'blur',
      validator: (a, b, callback) => {
        const url = formData.value.detail.url
        if (url) {
          const driver = getDatabaseDriverInfo('mysql', formData.value.detail.driver)
          const match = url.match(/jdbc:.*:\/\//)
          if (match) {
            if (match[0] !== `jdbc:${driver?.flag || 'mysql'}://`) {
              throw new Error('URL 与 数据库驱动不一致，请检查后重新填写')
            }
          }
        }
        callback()
      }
    }
  ]
}

const activeTab = ref('general')

/**
 * 根据驱动修改url的驱动值
 */
const onChangeUrlByDriver = () => {
  commonFormRef.value!.formRef!.clearValidate('detail.url')
  const url = formData.value.detail.url
  if (url) {
    const driver = getDatabaseDriverInfo('mysql', formData.value.detail.driver)
    formData.value.detail.url = url.replace(/jdbc:\w*:\/\//, `jdbc:${driver?.flag || 'mysql'}://`)
  }
}

const timeZonesOptions: { value: string; label: string }[] = TimeZones.map(_ => ({
  value: _,
  label: _
}))
</script>

<template>
  <common-form
    ref="commonFormRef"
    v-if="dataInitCompleted"
    v-model="formData"
    :rules="formRules"
  >
    <el-tabs
      v-model="activeTab"
      style="--el-tab-pane-width: 100px"
    >
      <el-tab-pane
        name="general"
        label="常规"
      >
        <el-row>
          <el-col :span="13">
            <el-form-item
              label="连接方式"
              prop="detail.connectionType"
            >
              <el-select
                v-model="formData.detail.connectionType"
                style="width: 100%"
              >
                <el-option
                  v-for="item in ConnectionTypes"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :span="9"
            :offset="2"
          >
            <el-form-item
              label="驱动"
              prop="detail.driver"
            >
              <el-select
                v-model="formData.detail.driver"
                @change="onChangeUrlByDriver"
              >
                <el-option
                  v-for="item in DatabaseDrivers.mysql"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="formData.detail.connectionType === 'default'">
          <el-col :span="13">
            <el-form-item
              label="主机"
              prop="host"
            >
              <el-input v-model="formData.host" />
            </el-form-item>
          </el-col>
          <el-col
            :span="9"
            :offset="2"
          >
            <el-form-item
              label="端口"
              prop="port"
            >
              <el-input-number
                v-model="formData.port"
                :controls="false"
                class="el-input-number__text-left"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="13">
            <el-form-item
              label="认证方式"
              prop="detail.authType"
            >
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

        <el-row v-if="formData.detail.authType === 'user_password'">
          <el-col :span="13">
            <el-form-item
              label="用户"
              prop="detail.username"
            >
              <el-input v-model="formData.detail.username" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="formData.detail.authType === 'user_password'">
          <el-col :span="13">
            <el-form-item
              label="密码"
              prop="detail.password"
            >
              <el-input
                v-model="formData.detail.password"
                type="password"
                show-password
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="9"
            :offset="2"
          >
            <el-form-item
              label="保存密码"
              prop="detail.savePwdType"
            >
              <el-select v-model="formData.detail.savePwdType">
                <el-option
                  v-for="item in SavePasswordTypes"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          v-if="formData.detail.connectionType === 'only_url'"
          label="URL"
          prop="detail.url"
        >
          <el-input
            v-model="formData.detail.url"
            type="textarea"
            resize="none"
            :autosize="{
              minRows: 1,
              maxRows: 5
            }"
          />
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane
        name="database"
        label="数据库"
      >
      </el-tab-pane>

      <el-tab-pane
        name="advanced"
        label="高级"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="时区"
              prop="detail.timeZone"
            >
              <el-select-v2
                v-model="formData.detail.timeZone"
                :options="timeZonesOptions"
                placeholder=" "
                clearable
                filterable
                :persistent="false"
                no-data-text="没有可匹配项"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="11"
            :offset="2"
          >
            <el-form-item
              label="编码"
              prop="detail.charset"
            >
              <el-select
                v-model="formData.detail.charset"
                filterable
                no-match-text="没有可匹配项"
              >
                <el-option
                  v-for="item in CharsetTypes"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="13"
            style="display: flex; align-items: center; margin-bottom: 18px"
          >
            <el-switch v-model="formData.detail.connectionInterval" />
            <span style="margin-left: 20px; width: 133px">保持连接间隔</span>
            <el-input-number
              v-model="formData.detail.connectionIntervalTime"
              :disabled="!formData.detail.connectionInterval"
              :controls="false"
              class="el-input-number__text-left"
              style="margin-left: 10px; width: 80px"
            />
            <span style="margin-left: 10px">秒</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="13"
            style="display: flex; align-items: center"
          >
            <el-switch v-model="formData.detail.autoBreak" />
            <span style="margin-left: 20px; width: 133px">此时间后自动断开</span>
            <el-input-number
              v-model="formData.detail.autoBreakTime"
              :disabled="!formData.detail.autoBreak"
              :controls="false"
              class="el-input-number__text-left"
              style="margin-left: 10px; width: 80px"
            />
            <span style="margin-left: 10px">秒</span>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </common-form>
</template>

<style scoped lang="scss"></style>
