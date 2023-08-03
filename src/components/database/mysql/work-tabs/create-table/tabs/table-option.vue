<!--
 * 表属性配置页面
 *
 * @author HuaYu
 * @date 2023-08-02 17:41
-->
<script setup lang="ts">
import CharacterAndCollate from '@/assets/data/mysql-character-collate.json'
import { Compressions } from '@/common/constants/MySqlConstant'
import { RowFormats } from '@/common/constants/MySqlConstant'
import {
  Engines,
  Storages,
  TableSpaces,
  CommonSelectOptions
} from '@/common/constants/MySqlConstant'

defineOptions({
  name: 'MySQLTableOptionSettingComponent'
})

const formData = defineModel<MySqlTableOption>({
  required: true
})

const Collates = computed(() => {
  return CharacterAndCollate[formData.value.character as keyof typeof CharacterAndCollate] || []
})

// 根据引擎来决定显示哪些字段
const visibleFields = computed<(keyof MySqlTableOption)[]>(() => {
  const engine = formData.value.engine as (typeof Engines)[number]
  switch (engine) {
    case 'ARCHIVE':
    case 'BLACKHOLE':
    case 'CSV':
    case 'PERFORMANCE_SCHEMA':
      return [
        'engine',
        'tableSpace',
        'storage',
        'character',
        'collate',
        'rowFormat',
        'avgRowLength',
        'maxRows',
        'minRows',
        'keyBlockSize'
      ]
    case 'InnoDB':
      return [
        'engine',
        'tableSpace',
        'storage',
        'character',
        'collate',
        'autoIncrement',
        'rowFormat',
        'avgRowLength',
        'maxRows',
        'minRows',
        'keyBlockSize',
        'dataDirectory',
        'indexDirectory',
        'statsAutoRecalc',
        'statsPersistent',
        'statsSamplePages',
        'compression',
        'encryption'
      ]
    case 'MEMORY':
      return [
        'engine',
        'tableSpace',
        'storage',
        'character',
        'collate',
        'autoIncrement',
        'rowFormat',
        'avgRowLength',
        'maxRows',
        'minRows',
        'keyBlockSize'
      ]
    case 'MyISAM':
      return [
        'engine',
        'tableSpace',
        'storage',
        'character',
        'collate',
        'autoIncrement',
        'checksum',
        'rowFormat',
        'avgRowLength',
        'maxRows',
        'minRows',
        'keyBlockSize',
        'packKeys',
        'delayKeyWrite',
        'dataDirectory',
        'indexDirectory'
      ]
    case 'MRG_MYISAM':
      return [
        'engine',
        'tableSpace',
        'storage',
        'union',
        'insertMethod',
        'character',
        'collate',
        'rowFormat',
        'avgRowLength',
        'maxRows',
        'minRows',
        'keyBlockSize'
      ]
    default:
      return []
  }
})
</script>

<template>
  <el-scrollbar always>
    <div style="width: 560px">
      <el-form
        :model="formData"
        label-width="140px"
        label-position="left"
      >
        <el-form-item
          v-if="visibleFields.includes('engine')"
          label="引擎"
        >
          <el-select
            v-model="formData.engine"
            style="width: 100%"
          >
            <el-option
              v-for="item in Engines"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('tableSpace')"
          label="表空间"
        >
          <el-select
            v-model="formData.tableSpace"
            clearable
            filterable
            placeholder=" "
            style="width: 100%"
          >
            <el-option
              v-for="item in TableSpaces"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('storage')"
          label="存储"
        >
          <el-select
            v-model="formData.storage"
            style="width: 100%"
            clearable
            placeholder=" "
          >
            <el-option
              v-for="item in Storages"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('union')"
          label="联合"
        >
          <el-input v-model="formData.union" />
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('insertMethod')"
          label="插入方法"
        >
          <el-select
            v-model="formData.insertMethod"
            clearable
            placeholder=" "
            style="width: 100%"
          >
            <el-option
              v-for="item in CommonSelectOptions"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('character')"
          label="字符集"
        >
          <el-select
            v-model="formData.character"
            clearable
            filterable
            placeholder=" "
            @clear="() => (formData.collate = void 0)"
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
          v-if="visibleFields.includes('collate')"
          label="排序规则"
        >
          <el-select
            v-model="formData.collate"
            clearable
            filterable
            placeholder=" "
            no-data-text="请先选择字符集"
            style="width: 100%"
          >
            <el-option
              v-for="item in Collates"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('autoIncrement')"
          label="自动递增"
        >
          <el-input-number
            v-model="formData.autoIncrement"
            :controls="false"
            class="el-input-number__text-left"
            style="width: 100%"
            :precision="0"
            :min="0"
            :value-on-clear="0"
          />
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('checksum')"
          label="校验和"
        >
          <el-switch v-model="formData.checksum" />
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('rowFormat')"
          label="行格式"
        >
          <el-select
            v-model="formData.rowFormat"
            clearable
            placeholder=" "
            style="width: 100%"
          >
            <el-option
              v-for="item in RowFormats"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('avgRowLength')"
          label="平均行长度"
        >
          <el-input-number
            v-model="formData.avgRowLength"
            :controls="false"
            class="el-input-number__text-left"
            style="width: 100%"
            :min="0"
            :precision="0"
            :value-on-clear="0"
          />
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('maxRows')"
          label="最大行数"
        >
          <el-input-number
            v-model="formData.maxRows"
            :controls="false"
            class="el-input-number__text-left"
            style="width: 100%"
            :min="0"
            :precision="0"
            :value-on-clear="0"
          />
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('minRows')"
          label="最小行数"
        >
          <el-input-number
            v-model="formData.minRows"
            :controls="false"
            class="el-input-number__text-left"
            style="width: 100%"
            :min="0"
            :precision="0"
            :value-on-clear="0"
          />
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('keyBlockSize')"
          label="键块大小"
        >
          <el-input-number
            v-model="formData.keyBlockSize"
            :controls="false"
            class="el-input-number__text-left"
            style="width: 100%"
            :min="0"
            :precision="0"
            :value-on-clear="0"
          />
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('packKeys')"
          label="封装键"
        >
          <el-select
            v-model="formData.packKeys"
            clearable
            placeholder=" "
            style="width: 100%"
          >
            <el-option
              v-for="item in CommonSelectOptions"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('delayKeyWrite')"
          label="延迟键写入"
        >
          <el-switch v-model="formData.delayKeyWrite" />
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('dataDirectory')"
          label="数据目录"
        >
          <el-input
            v-model="formData.dataDirectory"
            :maxlength="500"
            :autosize="{
              maxRows: 5
            }"
            type="textarea"
            resize="none"
          />
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('indexDirectory')"
          label="索引目录"
        >
          <el-input
            v-model="formData.indexDirectory"
            :maxlength="500"
            :autosize="{
              maxRows: 5
            }"
            type="textarea"
            resize="none"
          />
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('statsAutoRecalc')"
          label="统计数据自动重计"
        >
          <el-select
            v-model="formData.statsAutoRecalc"
            clearable
            placeholder=" "
            style="width: 100%"
          >
            <el-option
              v-for="item in CommonSelectOptions"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('statsPersistent')"
          label="统计数据持久"
        >
          <el-select
            v-model="formData.statsPersistent"
            clearable
            placeholder=" "
            style="width: 100%"
          >
            <el-option
              v-for="item in CommonSelectOptions"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('statsSamplePages')"
          label="统计样本页面"
        >
          <el-input v-model="formData.statsSamplePages" />
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('compression')"
          label="压缩"
        >
          <el-select
            v-model="formData.compression"
            clearable
            placeholder=" "
            style="width: 100%"
          >
            <el-option
              v-for="item in Compressions"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="visibleFields.includes('encryption')"
          label="加密"
        >
          <el-switch v-model="formData.encryption" />
        </el-form-item>
      </el-form>
    </div>
  </el-scrollbar>
</template>

<style scoped lang="scss"></style>
