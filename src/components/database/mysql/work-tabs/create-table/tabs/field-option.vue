<!--
 * 字段属性配置组件
 *
 * @author HuaYu
 * @date 2023-08-01 22:36
-->
<script setup lang="ts">
import { MySQLDataType } from '@/common/constants/DataTypeConstant'
import CharacterAndCollate from '@/assets/data/mysql-character-collate.json'
import SetEnumValuesPopover from '@/components/ui/set-enum-values-popover/index.vue'

type FormDataType = Partial<Record<MySqlTableFieldOption | 'virtualType' | 'virtualExp', any>>

defineOptions({
  name: 'MySQLCreateTableTabFieldOptionComponent'
})

const props = defineProps<{
  field: TableColumn
}>()
const emits = defineEmits<{
  (e: 'change-option', option: FormDataType): void
}>()
const formData = reactive<FormDataType>({
  default_value: ''
})
// 标识字段用到了哪些属性
const optionsComFlags = computed(() => {
  return MySQLDataType[props.field.dataType]?.options || []
})
// 设置的枚举值
const enumValues = ref<string[]>([])
const onChangeEnums = (data: any, formData: FormDataType) => {
  formData.enum_values = data.text
  enumValues.value = data.text.split(',') || []
}

const collates = computed<string[]>(() => {
  return CharacterAndCollate[formData.character as keyof typeof CharacterAndCollate] || []
})

// 变更字段数据类型后需要情况默认值
watch(
  () => props.field.dataType,
  () => {
    formData.default_value = ''
  }
)

watch(
  () => formData,
  () => {
    emits('change-option', formData)
  },
  { deep: true }
)

watch(
  () => formData.character,
  () => {
    formData.collate = null
  }
)
</script>

<template>
  <div
    v-if="optionsComFlags.length >= 1"
    class="container"
  >
    <el-form
      :model="formData"
      :label-width="80"
      label-position="left"
    >
      <!-- 设置虚拟属性 -->
      <!-- <el-form-item
        v-if="props.field.virtual"
        label="虚拟类型"
        prop="virtualType"
      >
        <el-select
          v-model="formData.virtualType"
          clearable
          style="width: 100%"
          placeholder=" "
        >
          <el-option
            v-for="item in ['STORED', 'VIRTUAL']"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="props.field.virtual"
        label="表达式"
        prop="virtualExp"
      >
        <el-input v-model="formData.virtualExp" />
      </el-form-item> -->

      <!-- 设置枚举值 -->
      <el-form-item
        v-if="optionsComFlags.includes('enum_values')"
        label="值"
      >
        <div style="width: 100%; display: flex; gap: 10px">
          <el-input
            v-model="formData.enum_values"
            disabled
            style="flex: 1"
          />
          <SetEnumValuesPopover @change-enums="data => onChangeEnums(data, formData)">
            <el-button type="info">设置</el-button>
          </SetEnumValuesPopover>
        </div>
      </el-form-item>

      <!-- 每个字段的独有属性 -->
      <el-form-item
        v-if="optionsComFlags.includes('default_value')"
        label="默认值"
        prop="default"
      >
        <el-select
          v-model="formData.default_value"
          clearable
          style="width: 100%"
          placeholder=" "
        >
          <el-option
            v-for="item in [
              'EMPTY_STRING',
              'NULL',
              ...(props.field.dataType === 'enum' || props.field.dataType === 'set'
                ? enumValues
                : [])
            ]"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="optionsComFlags.includes('auto_increment')"
        label="自动递增"
        prop="auto_increment"
      >
        <el-switch v-model="formData.auto_increment" />
      </el-form-item>

      <el-form-item
        v-if="optionsComFlags.includes('un_signed')"
        label="无符号"
        prop="un_signed"
      >
        <el-switch v-model="formData.un_signed" />
      </el-form-item>

      <el-form-item
        v-if="optionsComFlags.includes('zero_fill')"
        label="零填充"
        prop="zero_fill"
      >
        <el-switch v-model="formData.zero_fill" />
      </el-form-item>

      <el-form-item
        v-if="optionsComFlags.includes('character')"
        label="字符集"
      >
        <el-select
          v-model="formData.character"
          placeholder=" "
          filterable
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in Object.keys(CharacterAndCollate)"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="optionsComFlags.includes('collate')"
        label="排序规则"
      >
        <el-select
          v-model="formData.collate"
          placeholder=" "
          filterable
          clearable
          no-data-text="请先选择字符集"
          style="width: 100%"
        >
          <el-option
            v-for="item in collates"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="optionsComFlags.includes('key_length')"
        label="键长度"
        prop="key_length"
      >
        <el-input-number
          :controls="false"
          :disabled="!props.field.pk"
          :precision="0"
          class="el-input-number__text-left"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item
        v-if="optionsComFlags.includes('binary')"
        label="二进制"
        prop="binary"
      >
        <el-switch v-model="formData.binary" />
      </el-form-item>

      <el-form-item
        v-if="optionsComFlags.includes('update_by_current_timestamp')"
        label="根据当前时间戳更新"
        prop="update_by_current_timestamp"
        :label-width="140"
      >
        <el-switch
          v-model="formData.update_by_current_timestamp"
        />
      </el-form-item>
    </el-form>
  </div>

  <div
    v-else
    class="dbtu-un-user-select none-options"
  >
    <span>此字段无特殊属性</span>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 500px;
  height: 100%;
  padding: 10px 0;
  position: relative;
}

.none-options {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dbtu-font-color-disabled);
}
</style>
