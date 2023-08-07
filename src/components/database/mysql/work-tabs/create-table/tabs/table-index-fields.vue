<!--
 * 创建索引, 选择表字段组件
 *
 * @author HuaYu
 * @date 2023-08-07 21:53
-->
<script setup lang="ts">
import type { TableColumnCtx } from 'element-plus'
import { useElementVisibility } from '@vueuse/core'
import { ArrayUtils } from '@/common/utils/ArrayUtils'

type TableColumn = TableColumnCtx<unknown>

defineOptions({
  name: 'MySqlTableIndexSettingForSelectFieldsComponent'
})

const popover = reactive({
  visible: false
})

const props = defineProps({
  fields: {
    type: Array as () => MySqlTableField[],
    required: true
  }
})

const subPartInputRef = ref()

const fields = defineModel<MySqlTableIndexField[]>({
  required: true
})
const selectedRow = ref<MySqlTableIndexField | null>(null)
const selectedColumn = ref<TableColumn | null>(null)

const addField = () => {
  fields.value.push({
    id: Date.now(),
    field: ''
  })

  selectedRow.value = fields.value[fields.value.length - 1]
}

const deleteField = () => {
  const b = ArrayUtils.remove(fields.value, selectedRow.value?.id, 'id')
  if (b) {
    if (fields.value.length === 0) {
      addField()
    } else {
      selectedRow.value = fields.value[0]
    }
  }
}

const moveTop = () => {
  ArrayUtils.moveTop(fields.value, selectedRow.value, 'id')
}

const moveBottom = () => {
  ArrayUtils.moveBottom(fields.value, selectedRow.value, 'id')
}

const onClickRow = (row: MySqlTableIndexField, column: TableColumn) => {
  selectedRow.value = row
  selectedColumn.value = column
}

watch(
  () => [selectedRow.value, selectedColumn.value],
  () => {
    nextTick(() => {
      if (selectedColumn.value?.property === 'subPart') {
        subPartInputRef.value?.focus()
      }
    })
  }
)

// #region 在滚动或者切换tab选项卡时, 使popover隐藏
const buttonRef = ref(null)
const btnVisible = useElementVisibility(buttonRef)
watch([btnVisible], () => {
  if (!btnVisible.value) {
    popover.visible = false
  }
})
// #endregion

onMounted(() => {
  addField()
})
</script>

<template>
  <div>
    <el-popover
      trigger="click"
      placement="top"
      :width="600"
      :persistent="false"
      :hide-after="0"
      :visible="popover.visible"
      transition=" "
    >
      <template #reference>
        <el-button
          ref="buttonRef"
          text
          link
          @click="popover.visible = true"
          style="padding: 0 10px"
        >
          <template #icon>
            <IconMoreFilled />
          </template>
        </el-button>
      </template>
      <div class="popover-container">
        <el-table
          :data="fields"
          border
          height="256px"
          highlight-current-row
          :current-row-key="selectedRow?.id"
          row-key="id"
          scrollbar-always-on
          @row-click="onClickRow"
          class="el-table-editable"
        >
          <el-table-column
            type="index"
            width="50px"
            label="#"
            align="center"
            class-name="bg-is-theme-color"
          >
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>

          <el-table-column
            label="字段"
            prop="field"
          >
            <template #default="{ row }">
              <el-select
                v-if="selectedRow?.id === row.id"
                v-model="row.field"
                placeholder=" "
                style="width: 100%"
              >
                <el-option
                  v-for="item in props.fields"
                  :key="item.id"
                  :value="item.field"
                  :label="item.field"
                />
              </el-select>
              <span
                v-else
                class="row-readonly-text"
              >
                {{ row.field }}
              </span>
            </template>
          </el-table-column>

          <el-table-column
            label="子部分"
            prop="subPart"
            width="150px"
          >
            <template #default="{ row }">
              <el-input-number
                v-if="selectedRow?.id === row.id"
                ref="subPartInputRef"
                v-model="row.subPart"
                :controls="false"
                class="el-input-number__text-left"
                style="width: 100%"
              />
              <span
                v-else
                class="row-readonly-text"
              >
                {{ row.subPart }}
              </span>
            </template>
          </el-table-column>
        </el-table>

        <div class="footer">
          <div>
            <el-button
              text
              link
              @click="addField"
            >
              <template #icon>
                <IconPlus />
              </template>
              添加字段
            </el-button>

            <el-button
              text
              link
              :disabled="!selectedRow"
              @click="deleteField"
            >
              <template #icon>
                <IconDelete />
              </template>
              删除字段
            </el-button>

            <el-button
              text
              link
              :disabled="!selectedRow"
              @click="moveTop"
            >
              <template #icon>
                <IconTop />
              </template>
              上移
            </el-button>

            <el-button
              text
              link
              :disabled="!selectedRow"
              @click="moveBottom"
            >
              <template #icon>
                <IconBottom />
              </template>
              下移
            </el-button>
          </div>

          <div>
            <el-button
              type="info"
              @click="popover.visible = false"
            >
              <span>关闭</span>
            </el-button>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/css-style/el-table-editable';

.popover-container {
  width: 100%;
  height: 300px;
}

.footer {
  margin-top: 10px;
  width: 100%;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
