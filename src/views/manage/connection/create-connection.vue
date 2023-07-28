<!--
 * 创建连接
 *
 * @author Junpeng.Li
 * @date 2023-07-03 21:
-->
<script setup lang="ts">
import { DatabaseTypes } from '@/common/constants/ConnectionConstant'
import { StringUtils } from '@/common/utils/StringUtils'
import { getCreateConnectionCom } from '@/components/database/component/create-connection'
import { Message, MessageBox } from '@/components/element-plus/el-feedback-util'
import { useConnectionStore } from '@/stores/ConnectionStore'
import { NumberUtils } from '@/common/utils/NumberUtils'

defineOptions({
  name: 'CreateConnectionDialog'
})

const emits = defineEmits<{
  // 连接创建/编辑成功
  (e: 'submit-success', data: ConnectionInfo<BaseConnectionDetail>): void
}>()

const dialog = reactive({
  visible: false,
  title: '',
  isEdit: false
})

const formData = ref<ConnectionInfo<BaseConnectionDetail> | {}>()

// 搜索数据库
const searchDb = ref<string>('')
const databases = computed(() => {
  let array = []
  let key: DatabaseIdent
  for (key in DatabaseTypes) {
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
 * @param data      表单数据（修改时传入）
 * @param db        打开对话框后，默认选中的数据库
 * @param groupId   默认选中的分组
 */
const open = (data?: ConnectionInfo<BaseConnectionDetail>, db: DatabaseIdent = 'mysql', groupId?: number) => {
  if (!data) {
    dialog.title = '创建连接'
    dialog.isEdit = false
    formData.value = {
      dbType: db,
      host: 'localhost',
      name: '@localhost'
    }
  } else {
    dialog.title = '编辑连接'
    dialog.isEdit = true
    formData.value = JSON.parse(JSON.stringify(data))
  }

  if (!NumberUtils.isEmpty(groupId) && formData.value) {
    (formData.value as ConnectionInfo<BaseConnectionDetail>).groupId = groupId
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
const formComponent = shallowRef(null)
const onChangeFormComponent = () => {
  if (!activeDb.value) {
    return
  }

  const component = getCreateConnectionCom(activeDb.value!.key)
  component().then(() => {
    formComponent.value = defineAsyncComponent(component)
  }).catch(() => {
    MessageBox.error(`加载 [ ${activeDb.value?.name} ] 数据库表单组件失败，请刷新页面后再试！`)
  })
}

const onCloseDialog = () => {
  dialog.visible = false
}

// 提交按钮文本
const confirmBtnText = computed(() => {
  return isCreateLoading.value
    ? '正在保存'
    : dialog.isEdit
      ? '保存' : '创建'
})

// region 提交表单 start //
const connectionStore = useConnectionStore()
const isCreateLoading = ref(false)
// 提交表单
const onConfirm = async () => {
  isCreateLoading.value = true

  const submitRequestFn = dialog.isEdit ? connectionStore.updateById : connectionStore.createConnection
  const {status, message, data} = await submitRequestFn(formData.value as ConnectionInfo<BaseConnectionDetail>)
  isCreateLoading.value = false
  if (status === 'success') {
    Message.success(message)
    onCloseDialog()
    emits('submit-success', data as ConnectionInfo<BaseConnectionDetail>)
  } else {
    await MessageBox.error(message)
  }
}

// endregion 提交表单 end //

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
    destroy-on-close
    width="50%"
  >
    <div style="height: 500px;">
      <el-container style="height: 100%;">
        <el-aside width="200px" style="height: 100%;overflow: hidden">
          <el-input
            v-model="searchDb"
            clearable
            placeholder="输入数据库名称查询"
          >
            <template #prefix>
              <el-icon>
                <IconSearch/>
              </el-icon>
            </template>
          </el-input>
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
        <el-main style="padding: 0 30px">
          <!-- bug: https://github.com/vuejs/language-tools/issues/3374 -->
          <component
            :is="formComponent as any"
            v-model="formData"
          />
        </el-main>
      </el-container>
    </div>

    <template #footer>
      <el-button
        type="info"
        @click="onCloseDialog"
      >
        <span>取消</span>
      </el-button>
      <el-button
        type="primary"
        @click="onConfirm"
        :loading="isCreateLoading"
      >
        <span>{{ confirmBtnText }}</span>
      </el-button>
    </template>
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
