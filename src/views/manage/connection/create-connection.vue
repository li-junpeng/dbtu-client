<!--
 * 创建连接
 *
 * @author Junpeng.Li
 * @date 2023-07-03 21:
-->
<script setup lang="ts">
import { computed, defineAsyncComponent, reactive, ref, shallowRef } from 'vue'
import { ElAside, ElContainer, ElDialog, ElIcon, ElInput, ElMain, ElScrollbar } from 'element-plus'
import { Lock as IconLock, Search as IconSearch } from '@element-plus/icons-vue'
import { DatabaseTypes } from '@/common/constants/ConnectionConstant'
import { StringUtils } from '@/common/utils/StringUtils'
import { getCreateConnectionCom } from '@/components/database/component/create-connection'
import { MessageBox } from '@/components/element-plus/el-feedback-util'

defineOptions({
  name: 'CreateConnectionDialog'
})

const dialog = reactive({
  visible: false,
  title: '',
  isEdit: false
})

// 搜索数据库
const searchDb = ref<string>('')
const databases = computed(() => {
  let array = []
  for (let key in DatabaseTypes) {
    const db = DatabaseTypes[key] as DatabaseDefineItem
    if (StringUtils.isEmpty(searchDb.value)
      || db.key.toLowerCase().indexOf(searchDb.value) >= 0
      || db.name.toLowerCase().indexOf(searchDb.value) >= 0
    ) {
      array.push(DatabaseTypes[key])
    }
  }
  return array
})

/**
 * 打开对话卡
 *
 * @param data  表单数据（修改时传入）
 * @param db    打开对话框后，默认选中的数据库
 */
const open = (data?: ConnectionInfo<BaseConnectionDetail>, db: DatabaseIdent = 'mysql') => {
  if (!data) {
    dialog.title = '创建连接'
    dialog.isEdit = false
    formData.value = {
      dbType: db,
      host: 'localhost',
      name: '@localhost',
    }
  } else {
    dialog.title = '编辑连接'
    dialog.isEdit = true
    formData.value = data
  }

  onClickDbItem(data ? DatabaseTypes[data.dbType] : DatabaseTypes[db])

  dialog.visible = true
}

// 选择左侧数据库类型
const activeDb = ref<DatabaseDefineItem | null>(null)
const onClickDbItem = (db: DatabaseDefineItem) => {
  // TODO 后续这里还要判断是否有权限（在商店购买）
  if (!db.used) {
    return
  }

  activeDb.value = db
  onChangeFormComponent()
}

// 动态加载表单组件
const formData = ref<ConnectionInfo<BaseConnectionDetail> | {}>()
const formComponent = shallowRef(null)
const onChangeFormComponent = () => {
  if (!activeDb.value) {
    return
  }

  const component = getCreateConnectionCom(activeDb.value!.key)
  component().then(() => {
    // @ts-ignore
    formComponent.value = defineAsyncComponent(component)
  }).catch(() => {
    MessageBox.error(`加载 [ ${activeDb.value?.name} ] 数据库表单组件失败，请刷新页面后再试！`)
  })
}

defineExpose({
  open
})

</script>

<template>
  <el-dialog
    v-model="dialog.visible"
    :title="dialog.title"
    draggable
    :close-on-click-modal="false"
    width="60%"
  >
    <div style="height: 500px;">
      <el-container style="height: 100%;">
        <el-aside width="200px" style="height: 100%;overflow: hidden">
          <el-input
            v-model="searchDb"
            :prefix-icon="IconSearch"
            clearable
            placeholder="输入数据库名称查询"
          />
          <el-scrollbar height="465px">
            <ul class="db-list-box">
              <li
                v-for="db in databases"
                :key="db.key"
                :class="{
                  'db-item': true,
                  'is-lock': !db.used,
                  'is-active': activeDb?.key === db.key
                }"
                @click="onClickDbItem(db)"
              >
                <span>{{ db.name }}</span>
                <el-icon v-if="!db.used">
                  <IconLock/>
                </el-icon>
              </li>
            </ul>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <component
            :is="formComponent"
            :form-data="formData"
          />
        </el-main>
      </el-container>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.db-list-box {
  list-style: none;
  margin-top: 5px;

  .db-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 34px;
    cursor: pointer;
    padding: 0 10px;
    margin-bottom: 5px;
    border-radius: var(--dbtu-border-radius);

    &.is-lock {
      color: var(--dbtu-font-color-disabled);
      cursor: not-allowed;
    }

    &:hover {
      background-color: var(--dbtu-hover-color);
    }

    &.is-active {
      color: var(--el-color-white);
      background-color: var(--dbtu-theme-color);
    }
  }
}
</style>
