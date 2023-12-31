<!--
 * 通用的创建连接表单
 *
 * @author Junpeng.Li
 * @date 2023-07-04 21:
-->
<script setup lang="ts">
import { usePropValue } from '@/common/utils/VueUtils'
import type { BasePropDefine } from '@/components/database/component/create-connection/common-form'
import { useCommonForm } from '@/components/database/component/create-connection/common-form'
import { useComponentRef } from '@/components/element-plus/element-plus-util'
import { useConnectionStore } from '@/stores/ConnectionStore'

defineOptions({
  name: 'CreateConnectionFormCommonHeaderComponent'
})

interface PropDefine extends BasePropDefine<BaseConnectionDetail> {
  labelWidth?: string
  rules?: any
}

const props = withDefaults(defineProps<PropDefine>(), {
  labelWidth: '80px',
  rules: {}
})

const emits = defineEmits(['update:modelValue'])

const connectionStore = useConnectionStore()
const formData = usePropValue<ConnectionInfo<BaseConnectionDetail>>(props.modelValue, emits)
const { isTestConnecting, onTestConnection } = useCommonForm(props, formData, {
  beforeTestConnection: () => {
    onChangeFormDisabled(true)
  },
  afterTestConnection: () => {
    onChangeFormDisabled(false)
  }
})

const formRef = useComponentRef(ElForm)

// region 表单禁用 start //
const formDisabled = ref(false)
const onChangeFormDisabled = (flag: boolean) => {
  formDisabled.value = flag
}
// endregion 表单禁用 end //

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
        :label-width="labelWidth"
        :rules="rules"
        :disabled="formDisabled"
        label-position="left"
      >
        <el-row>
          <el-col :span="13">
            <el-form-item
              label="连接名"
              prop="name"
            >
              <el-input v-model="formData.name" />
            </el-form-item>
          </el-col>
          <el-col
            :span="9"
            :offset="2"
          >
            <el-form-item
              label="分组"
              prop="groupId"
            >
              <el-select
                v-model="formData.groupId"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in connectionStore.findGroups()"
                  :key="item.id as number"
                  :value="item.id as number"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="说明"
          prop="comment"
        >
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
      <el-button
        link
        :loading="isTestConnecting"
        @click="onTestConnection"
        style="padding: 0"
      >
        <span>测试连接</span>
      </el-button>
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