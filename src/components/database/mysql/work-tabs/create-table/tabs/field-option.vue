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

defineOptions({
  name: 'MySQLCreateTableTabFieldOptionComponent'
})

const columnInfo = defineModel<TableColumn>({
  required: true,
  default: {}
})

// 标识字段用到了哪些属性
const optionsComFlags = computed(() => {
  return MySQLDataType[columnInfo.value.dataType]?.options || []
})
// 设置的枚举值
const enumValuesText = ref('')
const onChangeEnums = (data: any) => {
  columnInfo.value.enums = data.enums.map((item: { id: number; enum: string }) => item.enum)
  enumValuesText.value = data.text
}

const collates = computed<string[]>(() => {
  return CharacterAndCollate[columnInfo.value.charSet as keyof typeof CharacterAndCollate] || []
})

// 变更字段数据类型后需要情况默认值
watch(
  () => columnInfo.value.dataType,
  () => {
    columnInfo.value.defaultValue = ''
  }
)

watch(
  () => columnInfo.value.charSet,
  () => {
    columnInfo.value.collate = void 0
  }
)
</script>

<template>
  <div
    v-if="optionsComFlags.length >= 1"
    class="container"
  >
    <el-form
      :model="columnInfo"
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
            v-model="enumValuesText"
            disabled
            style="flex: 1"
          />
          <SetEnumValuesPopover @change-enums="data => onChangeEnums(data)">
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
          v-model="columnInfo.defaultValue"
          clearable
          style="width: 100%"
          placeholder=" "
        >
          <el-option
            v-for="item in [
              'EMPTY_STRING',
              'NULL',
              ...(columnInfo.dataType === 'enum' || columnInfo.dataType === 'set' ? (columnInfo.enums || []) : [])
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
        <el-switch v-model="columnInfo.autoIncrement" />
      </el-form-item>

      <el-form-item
        v-if="optionsComFlags.includes('un_signed')"
        label="无符号"
        prop="un_signed"
      >
        <el-switch v-model="columnInfo.unsigned" />
      </el-form-item>

      <el-form-item
        v-if="optionsComFlags.includes('zero_fill')"
        label="零填充"
        prop="zero_fill"
      >
        <el-switch v-model="columnInfo.zeroFill" />
      </el-form-item>

      <el-form-item
        v-if="optionsComFlags.includes('character')"
        label="字符集"
      >
        <el-select
          v-model="columnInfo.charSet"
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
          v-model="columnInfo.collate"
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

      <!-- <el-form-item
        v-if="optionsComFlags.includes('key_length')"
        label="键长度"
        prop="key_length"
      >
        <el-input-number
          :controls="false"
          :disabled="!columnInfo.pk"
          :precision="0"
          class="el-input-number__text-left"
          style="width: 100%"
        />
      </el-form-item> -->

      <el-form-item
        v-if="optionsComFlags.includes('binary')"
        label="二进制"
        prop="binary"
      >
        <el-switch v-model="columnInfo.binary" />
      </el-form-item>

      <el-form-item
        v-if="optionsComFlags.includes('update_by_current_timestamp')"
        label="根据当前时间戳更新"
        prop="update_by_current_timestamp"
        :label-width="140"
      >
        <el-switch v-model="columnInfo.onUpdateTimestamp" />
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
