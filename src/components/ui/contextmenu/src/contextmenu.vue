<template>
  <div
    ref="comRef"
    class="ap-contextmenu"
    :style="wrapperStyle"
  >
    <div
      v-for="(menu, index) in menus"
      :key="menu.label"
    >
      <div
        v-show="!menu.hidden"
        class="menu-item"
        :class="[menu.disabled && 'menu-item__disabled']"
        @mousedown.stop="e => onClickItem(menu, index, e)"
        @mouseenter="e => onMouseenterItem(menu, e)"
      >
        <div class="menu-item__main">
          <!-- 菜单图标 -->
          <div
            v-if="props.showIcon"
            class="menu-item__icon"
          >
            <el-icon
              v-if="menu.loading"
              class="is-loading"
            >
              <Loading />
            </el-icon>
            <el-icon v-else-if="menu.icon">
              <component :is="menu.icon" />
            </el-icon>
          </div>
          <!-- 文本 -->
          <div class="menu-item__text">{{ menu.label || '' }}</div>
          <!-- 子菜单箭头 -->
          <div
            v-if="isAllowAppendChild(menu)"
            class="menu-item__child__arrow"
          >
            <el-icon>
              <ArrowRight />
            </el-icon>
          </div>
        </div>
      </div>
      <!-- 菜单分割线 -->
      <div
        v-if="menu.divided"
        class="menu-item__divided"
        @click.stop="onClickDivided"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, Loading } from '@element-plus/icons-vue'
import { contextmenuProps } from './constants'
import { useContextmenu } from './use-contextmenu'

const props = defineProps(contextmenuProps)

const menus: Ref = toRef(props, 'menus')
const comRef = ref<HTMLElement>()

const { wrapperStyle, onClose, onClickDivided, onClickItem, onMouseenterItem, isAllowAppendChild } =
  useContextmenu(props, comRef)

defineExpose({
  onClose
})
</script>

<style lang="scss">
@import '../style/contextmenu';
</style>
