<!--
 * 数据排序抽屉组件
 *
 * @author Junpeng.Li
 * @date 2023-07-28 21:
-->
<script setup lang="ts">
import type { DataSortDrawerProp, DataSortItem } from '@/components/ui/data-sort-drawer/define'
import { DataSortDrawerPropDefault } from '@/components/ui/data-sort-drawer/define'
import { MessageBox } from '@/components/element-plus/el-feedback-util'
import SqlCodePreview from '@/components/ui/sql-code-preview/index.vue'
import { TooltipShowAfter } from '@/components/element-plus/element-plus-util'
import Contextmenu from '@/components/ui/contextmenu'

defineOptions({
  name: 'DataSortDrawerComponent'
})

const drawer = reactive({
  visible: false
})
const props = withDefaults(defineProps<DataSortDrawerProp>(), DataSortDrawerPropDefault)
const emits = defineEmits<{
  (e: 'apply-sort', sql: string): void
}>()
const sorts = reactive<DataSortItem[]>([])
const sql = computed(() => {
  const array: string[] = []
  sorts.forEach(item => {
    if (item.use) {
      array.push(`\`${item.field}\` ${item.rule}`)
    }
  })
  return array.join(', ')
})

const open = () => {
  drawer.visible = true
}

const onAddSort = () => {
  if (props.fields.length === 0) {
    MessageBox.error('没有可用的字段，无法添加排序规则')
    return
  }

  sorts.push({
    key: Date.now(),
    field: props.fields[0],
    rule: 'ASC',
    use: 1
  })
}

const onChangeRule = (item: DataSortItem) => {
  item.rule = item.rule === 'ASC' ? 'DESC' : 'ASC'
}

const onApply = () => {
  emits('apply-sort', sql.value)
  drawer.visible = false
}

const onDeleteSort = (index: number) => {
  sorts.splice(index, 1)
}

const sortItemContextmenu = (event: MouseEvent, index: number) => {
  Contextmenu({
    event,
    zIndex: 9999,
    menus: [
      {
        label: '删除规则',
        onClick: () => {
          sorts.splice(index, 1)
        }
      }
    ]
  })
}

defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="drawer.visible"
    :title="props.title"
    :append-to-body="props.appendToBody"
    :close-on-click-modal="false"
    direction="rtl"
    :size="500"
  >
    <div class="toolbox">
      <el-button
        text
        link
        @click="onAddSort()"
      >
        <template #icon>
          <DIconSort />
        </template>
        <span>添加排序</span>
      </el-button>
    </div>

    <div style="width: 100%; height: calc(100% - 270px)">
      <el-scrollbar v-if="sorts.length >= 1">
        <div
          v-for="(item, index) in sorts"
          :key="item.key"
          class="data-sort-item dbtu-un-user-select"
          @contextmenu.prevent="sortItemContextmenu($event, index)"
        >
          <div class="data-sort-item__left">
            <el-checkbox
              v-model="item.use"
              :true-label="1"
              :false-label="0"
            />
            <el-popover
              :width="300"
              trigger="click"
              :hide-after="0"
              :persistent="false"
            >
              <template #reference>
                <span
                  class="keyword-text dbtu-text-ellipsis"
                  style="cursor: pointer; max-width: 300px"
                >
                  {{ item.field }}
                </span>
              </template>
              <template #default>
                <div style="width: 100%; height: 300px">
                  <el-scrollbar>
                    <div
                      v-for="field in fields"
                      :key="field"
                      class="data-field-item"
                      :class="{
                        'is-selected': item.field === field
                      }"
                      @click="item.field = field"
                    >
                      <span class="dbtu-text-ellipsis">{{ field }}</span>
                    </div>
                  </el-scrollbar>
                </div>
              </template>
            </el-popover>
            <el-button
              text
              link
              @click="onChangeRule(item)"
            >
              <span>{{ item.rule }}</span>
            </el-button>
          </div>
          <div class="data-sort-item__right">
            <el-tooltip
              content="删除规则"
              :enterable="false"
              :show-after="TooltipShowAfter"
            >
              <el-button
                text
                link
                @click="onDeleteSort(index)"
              >
                <template #icon>
                  <IconDelete />
                </template>
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </el-scrollbar>
      <div
        v-else
        style="position: relative; width: 100%; height: 40%"
      >
        <span
          class="dbtu-vertical-center dbtu-un-user-select"
          style="color: var(--dbtu-font-color-disabled)"
          >暂无排序规则</span
        >
      </div>
    </div>

    <div style="width: 100%; height: 200px">
      <p class="dbtu-un-user-select code-preview-title">SQL预览</p>
      <sql-code-preview :code="sql" />
    </div>

    <template #footer>
      <el-button
        type="info"
        @click="drawer.visible = false"
        >关闭</el-button
      >
      <el-button
        type="primary"
        @click="onApply"
        >应用</el-button
      >
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
.toolbox {
  width: 100%;
  height: 40px;
}

.code-preview-title {
  color: var(--dbtu-font-color);
  border-top: 1px solid var(--dbtu-divide-borer-color);
  padding: 10px 0;
  margin-top: 10px;
}

.data-sort-item {
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  &:hover {
    background-color: var(--dbtu-hover-color);
  }

  .keyword-text {
    color: var(--dbtu-theme-color);
  }

  .data-sort-item__left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .data-sort-item__right {
    display: none;
  }

  &:hover .data-sort-item__right {
    display: block;
  }
}

.data-field-item {
  width: 100%;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  cursor: pointer;

  &:not(.is-selected):hover {
    background-color: var(--dbtu-hover-color);
  }

  &.is-selected {
    background-color: var(--dbtu-theme-color);
    color: #fff;
    border-radius: var(--dbtu-border-radius);
  }

  span {
    display: inline-block;
    width: 100%;
  }
}
</style>