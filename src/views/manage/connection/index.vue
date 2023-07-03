<script setup lang="ts">
import { defineAsyncComponent, reactive, ref, shallowRef } from 'vue'
import { ElAside, ElButton, ElContainer, ElHeader, ElInput, ElMain, ElOption, ElSelect } from 'element-plus'
import { Plus as IconPlus, Search as IconSearch } from '@element-plus/icons-vue'
import { DatabaseTypes } from '@/common/constants/ConnectionConstant'
import { ArrayUtils } from '@/common/utils/ArrayUtils'
import { getConnectionDetailCom } from '@/components/database/connection-detail'
import { MessageBox } from '@/components/element-plus/el-feedback-util'
import DataTable from './data-table.vue'

defineOptions({
  name: 'ConnectionPage'
})

// 查询参数
const searchParams = reactive<ConnectionListSearchParams>({
  dbType: 'all',
  name: ''
})
const dbTypes = ArrayUtils.unshift<any>(
  Object.values(DatabaseTypes),
  {
    key: 'all',
    name: '全部'
  }
)

// 根据数据库类型，动态显示
const selectedConnectionInfo = ref<ConnectionInfo | null>(null)
const detailComponent = shallowRef(null)
const onChangeDetailComponent = (row: ConnectionInfo) => {
  const component = getConnectionDetailCom(row.dbType)
  component().then(() => {
    selectedConnectionInfo.value = row
    // @ts-ignore
    detailComponent.value = defineAsyncComponent(component)
  }).catch(() => {
    MessageBox.error(`加载[ ${DatabaseTypes[row.dbType].name} ]数据库详情组件失败，请刷新页面后再试！`)
  })
}
</script>

<template>
  <el-container style="height: 100%">
    <el-main>
      <el-header class="header-toolbox" height="32px">
        <div class="left-actions">
          <el-button type="primary" :icon="IconPlus">新建连接</el-button>
          <el-select
            v-model="searchParams.dbType"
            style="width: 180px"
          >
            <el-option
              v-for="item in dbTypes"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
          <el-input
            v-model="searchParams.name"
            placeholder="输入连接名查询"
            :prefix-icon="IconSearch"
            style="width: 300px"
            clearable
          />
        </div>
        <div>
          <el-button>排序</el-button>
        </div>
      </el-header>
      <el-main>
        <data-table
          class="data-table-box"
          @select-row="onChangeDetailComponent"
        />
      </el-main>
    </el-main>
    <el-aside class="right-detail" width="300px">
      <div
        v-if="detailComponent === null"
        class="dbtu-vertical-center dbtu-un-user-select no-data"
      >暂无数据
      </div>
      <component
        v-else
        :is="detailComponent"
        :connection-info="selectedConnectionInfo"
      />
    </el-aside>
  </el-container>
</template>

<style scoped lang="scss">
.header-toolbox {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: nowrap;

  .left-actions {
    display: flex;
    gap: 10px;
    flex-wrap: nowrap;
  }
}

.right-detail {
  position: relative;
  border-left: 1px solid var(--dbtu-divide-borer-color);
  overflow: auto;

  .no-data {
    color: var(--dbtu-font-color-disabled);
  }
}
</style>
