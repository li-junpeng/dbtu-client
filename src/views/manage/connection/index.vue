<script setup lang="ts">
import { reactive } from 'vue'
import { ElButton, ElInput, ElSelect, ElOption } from 'element-plus'
import { Plus as IconPlus, Search as IconSearch } from '@element-plus/icons-vue'
import { DatabaseTypes } from '@/common/constants/ConnectionConstant'
import { ArrayUtils } from '@/common/utils/ArrayUtils'

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
</script>

<template>
  <div class="connection-page-container">
    <div class="toolbar-box">
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
    </div>
  </div>
</template>

<style scoped lang="scss">
.connection-page-container {
  width: 100%;
  height: 100%;
  padding: 40px 20px;

  .toolbar-box {
    display: flex;
    justify-content: space-between;
    gap: 100px;

    .left-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
}
</style>
