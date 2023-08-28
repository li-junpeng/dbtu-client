<!--
 * 简易版分页
 *
 * @author HuaYu
 * @date 2023-08-28 21:58
-->
<script setup lang="ts">
import { TooltipShowAfter, useComponentRef } from '@/components/element-plus/element-plus-util'
import { type PaginationProp, type PageChangeType } from './pagination'

defineOptions({
  name: 'PaginationComponent'
})

// 当前的页码
const currentPage = ref(1)
// 是在执行props.changePage()
const isCallChangeFn = ref(false)
const props = defineProps<PaginationProp>()
const inputNumberRef = useComponentRef(ElInputNumber)

const onChangePage = async (action: PageChangeType) => {
  isCallChangeFn.value = true

  try {
    const page = await props.changePage(currentPage.value, action)
    currentPage.value = page
  } finally {
    isCallChangeFn.value = false
  }
}

/**
 * 第一页
 */
const toFirstPage = () => {
  onChangePage('first')
}

/**
 * 上一页
 */
const toPrevPage = () => {
  onChangePage('prev')
}

/**
 * 下一页
 */
const toNextPage = async () => {
  onChangePage('next')
}

/**
 * 最后一页, 需要组件使用者自行补充最后一页的页码...
 */
const toLastPage = async () => {
  onChangePage('last')
}

/**
 * 输入框失去焦点
 */
const onInputBlur = () => {
  onChangePage('input')
}

/**
 * 在输入框内按下了回车事件
 */
const onInputEnter = () => {
  inputNumberRef.value?.blur()
  onChangePage('input')
}
</script>

<template>
  <div class="pagination-box">
    <el-tooltip
      content="第一页"
      :enterable="false"
      :show-after="TooltipShowAfter"
    >
      <el-button
        text
        link
        :disabled="currentPage === 1 || isCallChangeFn"
        @click="toFirstPage"
      >
        <template #icon>
          <div style="transform: rotate(90deg)">
            <IconDownload />
          </div>
        </template>
      </el-button>
    </el-tooltip>

    <el-tooltip
      content="上一页"
      :enterable="false"
      :show-after="TooltipShowAfter"
    >
      <el-button
        text
        link
        :disabled="currentPage === 1 || isCallChangeFn"
        @click="toPrevPage"
      >
        <template #icon>
          <IconBack />
        </template>
      </el-button>
    </el-tooltip>

    <el-input-number
      ref="inputNumberRef"
      v-model="currentPage"
      :controls="false"
      :min="1"
      :max="99999999"
      :precision="0"
      :value-on-clear="1"
      :disabled="isCallChangeFn"
      style="margin: 0 10px; height: 24px; width: 50px"
      @blur="onInputBlur"
      @keydown.enter="onInputEnter"
    />

    <el-tooltip
      content="下一页"
      :enterable="false"
      :show-after="TooltipShowAfter"
    >
      <el-button
        text
        link
        :disabled="isCallChangeFn"
        @click="toNextPage"
      >
        <template #icon>
          <IconRight />
        </template>
      </el-button>
    </el-tooltip>

    <el-tooltip
      content="最后一页"
      :enterable="false"
      :show-after="TooltipShowAfter"
    >
      <el-button
        text
        link
        :disabled="isCallChangeFn"
        @click="toLastPage"
      >
        <template #icon>
          <div style="transform: rotate(-90deg)">
            <IconDownload />
          </div>
        </template>
      </el-button>
    </el-tooltip>
  </div>
</template>

<style scoped lang="scss">
.pagination-box {
  width: auto;
  height: 100%;
  display: flex;
  align-items: center;

  :deep(.el-input-number) {
    &.is-without-controls .el-input__wrapper {
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>
