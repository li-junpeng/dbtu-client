<!--
 * 字段属性配置组件
 *
 * @author HuaYu
 * @date 2023-08-01 22:36
-->
<script setup lang="ts">
import { MySQLDataType } from '@/common/constants/DataTypeConstant'
import type { MySQLDataTypeFieldOption } from '@/common/constants/DataTypeConstant'
import type { TableField } from '..'

defineOptions({
  name: 'MySQLCreateTableTabFieldOptionComponent'
})

const props = defineProps<{
  field: TableField
}>()

const formData = reactive<
  Partial<Record<MySQLDataTypeFieldOption | 'virtualType' | 'virtualExp', any>>
>({
  default_value: ''
})
const optionsComFlags = computed(() => {
  return MySQLDataType[props.field.dataType]?.options || []
})
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
      <el-form-item
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
            v-for="item in ['EMPTY_STRING', 'NULL']"
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

      <!-- TODO 字符集、排序规则、枚举值组件还没有写呢 -->
      <!-- TODO 开启虚拟字段后, 默认值不可以修改, 根据当前时间戳更新也不可以修改, 其他的属于暂时未发现 -->
      <!-- TODO 当修改了字段后, 清空字段属性配置 -->

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
        <el-switch v-model="formData.update_by_current_timestamp" />
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
