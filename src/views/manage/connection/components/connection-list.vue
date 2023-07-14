<!--
 * 连接列表
 *
 * @author Junpeng.Li
 * @date 2023-07-14 16-35
-->
<script setup lang="ts">
import { inject } from 'vue'
import { ElButton, ElIcon, ElTooltip } from 'element-plus'
import { FolderAdd as IconFolderAdd, Minus as IconMinus, Plus as IconPlus } from '@element-plus/icons-vue'
import { InjectionKey } from '@/common/constants/ConnectionConstant'

defineOptions({
  name: 'ConnectionListComponent'
})

const openCreateConnection = inject<(data?: ConnectionInfo<BaseConnectionDetail>, db?: DatabaseIdent) => void>(InjectionKey.openCreateConnection)
const openCreateGroup = inject<(name?: string) => void>(InjectionKey.openCreateGroup)

</script>

<template>
  <div class="box-header">
    <span>连接列表</span>
    <div class="btn-list">
      <el-tooltip
        content="创建分组"
        :enterable="false"
      >
        <el-button
          text
          link
          @click="() => openCreateGroup?.()"
        >
          <template #icon>
            <el-icon :size="16">
              <IconFolderAdd/>
            </el-icon>
          </template>
        </el-button>
      </el-tooltip>
      <el-tooltip
        content="创建连接"
        :enterable="false"
      >
        <el-button
          :icon="IconPlus"
          text
          link
          @click="() => openCreateConnection?.()"
        ></el-button>
      </el-tooltip>
      <el-tooltip
        content="最小化"
        :enterable="false"
      >
        <el-button :icon="IconMinus" text link></el-button>
      </el-tooltip>
    </div>
  </div>
  <div class="box-content">

  </div>
</template>

<style scoped lang="scss">
.box-header {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  color: var(--dbtu-font-color);
}

.box-content {
  width: 100%;
  height: calc(100% - 40px);
  background-color: red;
  overflow: auto;
}

</style>
