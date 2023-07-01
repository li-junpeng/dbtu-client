<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElContainer, ElHeader, ElAside, ElMain, ElButton, ElInput, ElSelect, ElOption } from 'element-plus'
import { Plus as IconPlus, Search as IconSearch } from '@element-plus/icons-vue'
import { DatabaseTypes } from '@/common/constants/ConnectionConstant'
import { ArrayUtils } from '@/common/utils/ArrayUtils'
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

const selectedRow = ref(null)

// demo 根据数据库类型，动态加载详情页面
const modules = import.meta.glob(`@/components/database/**/connection-detail.vue`)
console.log(modules)

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
        <data-table class="data-table-box"/>
      </el-main>
    </el-main>
    <el-aside class="right-detail" width="300px">
      <div
        v-if="selectedRow === null"
        class="dbtu-vertical-center dbtu-un-user-select no-data"
      >暂无数据</div>
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
