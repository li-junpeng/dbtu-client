<!--
 * 动态异步加载组件失败页面
 *
 * @author HuaYu
 * @date 2023-08-08 22:15
-->
<script setup lang="ts">
import AsyncErrorIcon from './async-error-icon.vue'

defineOptions({
  name: 'AsyncErrorPage'
})
</script>

<template>
  <div class="error-container">
    <el-icon :size="400">
        <AsyncErrorIcon />
      </el-icon>
      <p>组件找不到了 &nbsp;&nbsp;&nbsp;&nbsp; o(╥﹏╥)o &nbsp;&nbsp;&nbsp;&nbsp;要不刷新页面试一试？</p>
  </div>
</template>

<style scoped lang="scss">
.error-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--dbtu-font-color);
}
</style>
