<!--
 * 通用loading页面
 *
 * @author HuaYu
 * @date 2023-08-08 17:47
-->
<script setup lang="ts">
defineOptions({
  name: 'CommonLoadingComponent'
})

defineProps({
  showText: {
    type: Boolean,
    default: true
  },

  loadingText: {
    type: String,
    default: '正在加载, 请稍等...'
  }
})
</script>

<template>
  <div class="loading-container">
    <div style="display: flex; flex-direction: column; align-items: center; gap: 20px">
      <div class="semi-polar-spinner">
        <div class="ring"></div>
        <div class="ring"></div>
        <div class="ring"></div>
        <div class="ring"></div>
        <div class="ring"></div>
      </div>

      <p v-show="showText">{{ loadingText }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loading-container {
  width: 100%;
  height: 100%;
  background-color: var(--el-mask-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dbtu-font-color);

  $time: 1.5s;
  $size: 45px;

  .semi-polar-spinner,
  .semi-polar-spinner * {
    box-sizing: border-box;
  }

  .semi-polar-spinner {
    height: $size;
    width: $size;
    position: relative;

    .ring {
      border-radius: 50%;
      position: absolute;
      border: calc($size * 0.05) solid transparent;
      border-top-color: var(--dbtu-theme-color);
      border-left-color: var(--dbtu-theme-color);
      animation: semi-polar-spinner-animation $time infinite;
    }

    .ring:nth-child(1) {
      height: calc($size - $size * 0.2 * 0);
      width: calc($size - $size * 0.2 * 0);
      top: calc($size * 0.1 * 0);
      left: calc($size * 0.1 * 0);
      animation-delay: calc($time * 0.1 * 4);
      z-index: 5;
    }

    .ring:nth-child(2) {
      height: calc($size - $size * 0.2 * 1);
      width: calc($size - $size * 0.2 * 1);
      top: calc($size * 0.1 * 1);
      left: calc($size * 0.1 * 1);
      animation-delay: calc($time * 0.1 * 3);
      z-index: 4;
    }

    .ring:nth-child(3) {
      height: calc($size - $size * 0.2 * 2);
      width: calc($size - $size * 0.2 * 2);
      top: calc($size * 0.1 * 2);
      left: calc($size * 0.1 * 2);
      animation-delay: calc($time * 0.1 * 2);
      z-index: 3;
    }

    .ring:nth-child(4) {
      height: calc($size - $size * 0.2 * 3);
      width: calc($size - $size * 0.2 * 3);
      top: calc($size * 0.1 * 3);
      left: calc($size * 0.1 * 3);
      animation-delay: calc($time * 0.1 * 1);
      z-index: 2;
    }

    .ring:nth-child(5) {
      height: calc($size - $size * 0.2 * 4);
      width: calc($size - $size * 0.2 * 4);
      top: calc($size * 0.1 * 4);
      left: calc($size * 0.1 * 4);
      animation-delay: calc($time * 0.1 * 0);
      z-index: 1;
    }
  }

  @keyframes semi-polar-spinner-animation {
    50% {
      transform: rotate(360deg) scale(0.7);
    }
  }
}
</style>
