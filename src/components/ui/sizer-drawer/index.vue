<!--
 * 筛选抽屉组件
 *
 * @author Junpeng.Li
 * @date 2023-07-27 09-56
-->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElButton, ElDrawer, ElInput, ElOption, ElScrollbar, ElSelect, ElTooltip, ElTree } from 'element-plus'
import type { TreeNode } from 'element-plus/es/components/tree-v2/src/types'
import IconAddCondition from '@/icons/svg/add-condition.vue'
import { Delete as IconDelete, EditPen as IconEditPen, Select as IconSelect } from '@element-plus/icons-vue'
import {
  type ConditionItem,
  type SizerDrawerProp,
  SizerDrawerPropDefault,
  TreeV2Props
} from '@/components/ui/sizer-drawer/define'
import { TooltipShowAfter, useComponentRef } from '@/components/element-plus/elemenet-plus-util'
import { JudgeConditions } from '@/common/constants/ConnectionConstant'

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
const editNodeData = ref<ConditionItem | null>(null)

const open = () => {
  drawer.visible = true
}

const onAddCondition = (parent?: ConditionItem) => {
  const defaultNode = {
    id: Date.now(),
    field: props.fields[0],
    condition: 'equal',
    value: '?',
    relation: 'and',
    childrenRelation: 'and'
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
  if (node.level === 1) {
    return node.data.id === node.parent?.data?.[0].id
  } else {
    return node.data.id === node.parent?.data.children?.[0].id
  }
}

const toSql = (): string => {
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
    array.forEach((item, index) => {
      if (index >= 1) {
        sql += `${item.relation.toUpperCase()} `
      }
      sql += `\`${item.field}\` ${getValue(item)} `
      if (item.children && item.children.length >= 1) {
        sql += `${item.childrenRelation!.toUpperCase()} (`
        dg(item.children)
        sql += `) `
      }
    })
  }
  dg(conditions)
  return sql
}

const onApply = () => {
  emits('apply-sizer', toSql())
  drawer.visible = false
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
    :size="780"
  >
    <div class="toolbox">
      <el-button text link :icon="IconAddCondition" @click="onAddCondition()">添加条件</el-button>
    </div>
    <div style="width: 100%;height: calc(100% - 40px)">
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
            <div v-if="editNodeData?.id !== data.id" class="i-tree-node">
              <div style="display: flex;gap: 10px;flex: 1;">
                <span v-if="!isFirstNode(node)">{{ data.relation }}</span>
                <span style="color: var(--dbtu-theme-color);">{{ data.field }}</span>
                <span>{{ JudgeConditions[data.condition] }}</span>
                <span style="color: var(--dbtu-theme-color);">{{ data.value }}</span>
                <span v-if="data.children && data.children.length >= 1">{{ data.childrenRelation }}</span>
              </div>
              <div class="i-tree-node__btns">
                <el-tooltip
                  content="编辑条件"
                  :enterable="false"
                  :show-after="TooltipShowAfter"
                >
                  <el-button text link :icon="IconEditPen" @click="editNodeData = data"></el-button>
                </el-tooltip>
                <el-tooltip
                  content="添加子条件"
                  :enterable="false"
                  :show-after="TooltipShowAfter"
                >
                  <el-button text link
                             :icon="IconAddCondition"
                             @click="onAddCondition(data)"></el-button>
                </el-tooltip>
                <el-tooltip
                  content="删除"
                  :enterable="false"
                  :show-after="TooltipShowAfter"
                >
                  <el-button text link
                             :icon="IconDelete"
                             @click="onDeleteCondition(node, data)"></el-button>
                </el-tooltip>
              </div>
            </div>
            <div v-else class="i-tree-node">
              <div style="display: flex;gap: 10px;">
                <!-- 连接关系 -->
                <el-button
                  v-if="!isFirstNode(node)"
                  text
                  link
                  type="primary"
                  @click="data.relation = data.relation === 'and' ? 'or' : 'and'"
                  style="width: 40px;"
                >
                  <span>{{ data.relation }}</span>
                </el-button>
                <!-- 字段 -->
                <el-select
                  v-model="data.field"
                  filterable
                  style="width: 200px;"
                >
                  <el-option
                    v-for="field in props.fields"
                    :key="field"
                    :value="field"
                    :label="field"
                  />
                </el-select>
                <!-- 判断条件 -->
                <el-select
                  v-model="data.condition"
                  style="width: 120px;"
                >
                  <el-option
                    v-for="(label, key) in JudgeConditions"
                    :key="key"
                    :value="key"
                    :label="label"
                  />
                </el-select>
                <!-- 值 -->
                <el-input
                  v-if="isNotNeedValue(data.condition)"
                  v-model="data.value"
                  style="flex: 1"
                />
                <!-- 与子语句连接关系 -->
                <el-button
                  v-if="data.children && data.children.length >= 1"
                  text
                  link
                  type="primary"
                  @click="data.childrenRelation = data.childrenRelation === 'and' ? 'or' : 'and'"
                  style="width: 40px;"
                >
                  <span>{{ data.childrenRelation }}</span>
                </el-button>
              </div>
              <div>
                <!-- 按钮组 -->
                <el-tooltip
                  content="保存"
                  :enterable="false"
                  :show-after="TooltipShowAfter"
                >
                  <el-button
                    text
                    link
                    :icon="IconSelect"
                    :disabled="isNotNeedValue(data.condition) && !data.value"
                    @click="editNodeData = null"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  content="添加子条件"
                  :enterable="false"
                  :show-after="TooltipShowAfter"
                >
                  <el-button
                    text
                    link
                    :icon="IconAddCondition"
                    @click="onAddCondition(data)"></el-button>
                </el-tooltip>
                <el-tooltip
                  content="删除"
                  :enterable="false"
                  :show-after="TooltipShowAfter"
                >
                  <el-button
                    text
                    link
                    :icon="IconDelete"
                    @click="onDeleteCondition(node, data)"></el-button>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
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

:deep(.el-tree) {

  .el-tree-node:focus > .el-tree-node__content ,
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
</style>
