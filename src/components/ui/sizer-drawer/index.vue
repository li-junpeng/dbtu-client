<!--
 * 筛选抽屉组件
 *
 * @author Junpeng.Li
 * @date 2023-07-27 09-56
-->
<script setup lang="ts">
import type { TreeNode } from 'element-plus/es/components/tree-v2/src/types'
import {
  type ConditionItem,
  type SizerDrawerProp,
  SizerDrawerPropDefault,
  TreeV2Props
} from '@/components/ui/sizer-drawer/define'
import { TooltipShowAfter, useComponentRef } from '@/components/element-plus/elemenet-plus-util'
import { JudgeConditions } from '@/common/constants/ConnectionConstant'
import SqlCodePreview from '@/components/ui/sql-code-preview/index.vue'
import Contextmenu from '@/components/ui/contextmenu'

defineOptions({
  name: 'SizerDrawerComponent'
})

const treeRef = useComponentRef(ElTree)
const drawer = reactive({
  visible: false
})
const props = withDefaults(defineProps<SizerDrawerProp>(), SizerDrawerPropDefault)
const emits = defineEmits<{
  /**
   * 应用筛选条件
   *
   * @param e     event name
   * @param sql   sql code
   */
  (e: 'apply-sizer', sql: string): void
}>()
const conditions = reactive<ConditionItem[]>([])

const open = () => {
  drawer.visible = true
}

const onAddCondition = (parent?: ConditionItem) => {
  const defaultNode = {
    id: Date.now(),
    field: props.fields[0],
    condition: 'equal',
    value: '',
    relation: 'AND',
    childrenRelation: 'AND',
    use: 1
  } as ConditionItem
  if (!parent) {
    conditions.push(defaultNode)
  } else {
    let children = parent.children
    if (!children) {
      children = []
    }
    children.push(defaultNode)
    parent.children = children
    const node = treeRef.value?.getNode(parent.id)
    node && (node.expanded = true)
  }
}

const onDeleteCondition = (node: TreeNode, data: ConditionItem) => {
  if (node.level === 1) {
    for (let i = 0; i < node.parent!.data.length; i++) {
      if (node.parent!.data[i].id === data.id) {
        node.parent!.data.splice(i, 1)
        break
      }
    }
  } else {
    for (let i = 0; i < node.parent!.data.children.length; i++) {
      if (node.parent!.data.children[i].id === data.id) {
        node.parent!.data.children.splice(i, 1)
        break
      }
    }
  }
}

const isNotNeedValue = (value: any) => {
  return ['is_null', 'not_is_null', 'is_blank', 'not_is_blank'].indexOf(value) < 0
}

const isFirstNode = (node: TreeNode) => {
  // 如果第一个节点是use = false 状态, 那么就以此类推, 找到第一个use = true的节点
  const compare = (id: number, items?: ConditionItem[]): boolean => {
    if (!items) {
      return false
    }
    let flag = 0
    for (let i = 0; i < items.length; i++) {
      if (!items[i].use) {
        flag++
        continue
      }
      return id === items![i].id && flag === i
    }
    return false
  }

  if (node.level === 1) {
    return compare(node.data.id, node.parent?.data as ConditionItem[])
  } else {
    return compare(node.data.id, node.parent?.data.children)
  }
}

const sql = computed(() => {
  if (conditions.length === 0) {
    return ''
  }

  const getValue = (item: ConditionItem): string => {
    switch (item.condition) {
      case 'is_null':
        return 'IS NULL'
      case 'not_is_null':
        return 'IS NOT NULL'
      case 'is_blank':
        return '= \'\''
      case 'not_is_blank':
        return '!= \'\''
      case 'like':
        return `LIKE '%${item.value}%'`
      case 'not_link':
        return `NOT LIKE '%${item.value}%'`
      case 'begin_like':
        return `LIKE '${item.value}%'`
      case 'not_begin_like':
        return `NOT LIKE '${item.value}%'`
      case 'end_link':
        return `LIKE '%${item.value}'`
      case 'noe_end_link':
        return `NOT LIKE '%${item.value}'`
      case 'between':
        return `BETWEEN '${(item.value as string).split(',').join('\' AND \'')}'`
      case 'noe_between':
        return `NOT BETWEEN '${(item.value as string).split(',').join('\' AND \'')}'`
      case 'in':
        return `IN ('${(item.value as string).split(',').join('\',\'')}')`
      case 'not_in':
        return `NOT IN ('${(item.value as string).split(',').join('\',\'')}')`
      default:
        return `${JudgeConditions[item.condition]} '${item.value}'`
    }
  }

  let sql = ''
  const dg = (array: ConditionItem[]) => {
    let flag = 1
    array.forEach((item, index) => {
      if (!item.use) {
        flag++
        return
      }
      if (index >= flag) {
        sql += `${item.relation.toUpperCase()} `
      }
      sql += `\`${item.field}\` ${getValue(item)} `
      if (item.children && item.children.length >= 1) {
        sql += `${item.childrenRelation!.toUpperCase()} ( `
        dg(item.children)
        sql += `) `
      }
    })
  }
  dg(conditions)
  return sql
})

const onApply = () => {
  emits('apply-sizer', sql.value)
  drawer.visible = false
}

const onChangeRelation = (item: ConditionItem, field: 'relation' | 'childrenRelation') => {
  const old = item[field]
  item[field] = old === 'AND' ? 'OR' : 'AND'
}

const treeNodeContextmenu = (event: MouseEvent, node: TreeNode, data: ConditionItem) => {
  Contextmenu({
    event,
    zIndex: 9999,
    menus: [
      {
        label: '添加子条件',
        onClick: () => {
          onAddCondition(data)
        }
      },
      {
        label: '删除',
        onClick: () => {
          onDeleteCondition(node, data)
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
      <el-button text link @click="onAddCondition()">
        <template #icon>
          <DIconAddCondition/>
        </template>
        <span>添加条件</span>
      </el-button>
    </div>
    <div style="width: 100%;height: calc(100% - 270px)">
      <el-scrollbar>
        <el-tree
          ref="treeRef"
          node-key="id"
          :data="conditions"
          :props="TreeV2Props"
          :expand-on-click-node="false"
          draggable
          empty-text="暂无筛选条件"
        >
          <template #default="{ node, data }">
            <div
              class="i-tree-node"
              @contextmenu.prevent.stop="treeNodeContextmenu($event, node, data)"
            >
              <div style="display: flex;gap: 10px;flex: 1;align-items: center;line-height: 40px">
                <el-checkbox v-model="data.use" :true-label="1" :false-label="0"/>
                <div
                  :style="{
                    display: 'flex',
                    gap: '10px',
                    color: data.use ? 'var(--dbtu-font-color)' : 'var(--dbtu-border-disabled-color)',
                    '--sizer-key-color': data.use ? 'var(--dbtu-theme-color)' : 'var(--dbtu-border-disabled-color)'
                  }"
                >
                  <!-- 与相邻节点的关系 -->
                  <span
                    v-if="!isFirstNode(node) && data.use"
                    @click="onChangeRelation(data, 'relation')"
                  >{{ data['relation'] }}</span>
                  <!-- 字段 -->
                  <el-popover
                    :width="200"
                    trigger="click"
                    :hide-after="0"
                    :persistent="false"
                  >
                    <template #reference>
                      <span :style="{
                        color: 'var(--sizer-key-color)'}"
                      >{{ data['field'] }}</span>
                    </template>
                    <template #default>
                      <div style="width: 100%;height: 300px;">
                        <el-scrollbar>
                          <div
                            v-for="item in props.fields"
                            :key="item"
                            @click="data.field = item"
                            class="data-field-item"
                            :class="{
                              'is-selected': data.field === item
                            }"
                          >

                            <span class="dbtu-text-ellipsis">{{ item }}</span>
                          </div>
                        </el-scrollbar>
                      </div>
                    </template>
                  </el-popover>
                  <!-- 运算符 -->
                  <el-popover
                    :width="200"
                    trigger="click"
                    :hide-after="0"
                    :persistent="false"
                  >
                    <template #reference>
                      <span>{{ JudgeConditions[data['condition']] }}</span>
                    </template>
                    <template #default>
                      <div style="width: 100%;height: 300px;">
                        <el-scrollbar>
                          <div
                            v-for="(label, key) in JudgeConditions"
                            :key="key"
                            @click="data.condition = key"
                            class="data-field-item"
                            :class="{
                              'is-selected': data.condition === key
                            }"
                          >{{ label }}
                          </div>
                        </el-scrollbar>
                      </div>
                    </template>
                  </el-popover>
                  <!-- 值 -->
                  <el-popover
                    v-if="isNotNeedValue(data.condition)"
                    :width="300"
                    trigger="click"
                    :hide-after="0"
                    :persistent="false"
                  >
                    <template #reference>
                      <span :style="{color: 'var(--sizer-key-color)'}">{{ data.value || '?' }}</span>
                    </template>
                    <template #default>
                      <el-input v-model="data.value"/>
                    </template>
                  </el-popover>
                  <!-- 与子条件的关系 -->
                  <span
                    v-if="data.children && data.children.length >= 1"
                    @click="onChangeRelation(data, 'childrenRelation')"
                  >{{ data['childrenRelation'] }}</span>
                </div>
              </div>
              <div class="i-tree-node__btns">
                <el-tooltip
                  content="添加子条件"
                  :enterable="false"
                  :show-after="TooltipShowAfter"
                >
                  <el-button
                    text
                    link
                    @click="onAddCondition(data)">
                    <template #icon>
                      <DIconAddCondition/>
                    </template>
                  </el-button>
                </el-tooltip>
                <el-tooltip
                  content="删除"
                  :enterable="false"
                  :show-after="TooltipShowAfter"
                >
                  <el-button
                    text
                    link
                    @click="onDeleteCondition(node, data)">
                    <template #icon>
                      <IconDelete/>
                    </template>
                  </el-button>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
    <div style="width: 100%;height: 200px;">
      <p class="dbtu-un-user-select code-preview-title">SQL 预览</p>
      <sql-code-preview :code="sql"/>
    </div>
    <template #footer>
      <el-button type="info" @click="drawer.visible = false">关闭</el-button>
      <el-button type="primary" @click="onApply">应用</el-button>
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

:deep(.el-tree) {

  .el-tree-node:focus > .el-tree-node__content,
  .el-tree-node__content:hover {
    .i-tree-node__btns {
      display: block;
    }
  }

  .el-tree-node__content {
    height: 40px;

    .i-tree-node__btns {
      display: none;
    }

    .i-tree-node {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding-right: 10px;
    }
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
