<!--
 * 主题设置
 *
 * @author Junpeng.Li
 * @date 2023-06-27 21:
-->
<script setup lang="ts">
import { reactive, watch } from 'vue'
import { ElForm, ElFormItem, ElIcon, ElRadio, ElRadioGroup, ElSlider } from 'element-plus'
import { Select as IconSelect } from '@element-plus/icons-vue'
// region theme images
import ThemeWhiteImg from '@/assets/images/theme/white.svg'
import ThemeDarkImg from '@/assets/images/theme/dark.svg'
import ThemeAutoImg from '@/assets/images/theme/auto.svg'
// endregion theme images
import { useSystemSettingStore } from '@/stores/SystemSettingStore'
import { ThemeColors, FONT_SIZE_MIN, FONT_SIZE_MAX } from '@/common/constants/SystemConstant'

interface ThemeModeItem {
  key: ThemeMode
  title: string
  image: string
}

defineOptions({
  name: 'SystemSettingThemePage'
})

const themeList: ThemeModeItem[] = [
  {
    key: 'light',
    title: '浅色',
    image: ThemeWhiteImg
  },
  {
    key: 'dark',
    title: '暗黑',
    image: ThemeDarkImg
  },
  {
    key: 'auto',
    title: '跟随系统',
    image: ThemeAutoImg
  }
]
const systemSettingStore = useSystemSettingStore()
const themeData = reactive(systemSettingStore.getSetting().theme)

// 修改主题模式
watch(() => themeData.mode, (mode) => {
  systemSettingStore.updateThemeMode(mode)
})

// 修改主题颜色
watch(() => themeData.color, (color) => {
  systemSettingStore.updateThemeColor(color)
})

// 修改字体大小
watch(() => themeData.fontSize, (size) => {
  systemSettingStore.updateThemeFontSize(size)
})
</script>

<template>
  <el-form
    v-model="themeData"
    label-position="top"
  >
    <el-form-item label="主题">
      <el-radio-group v-model="themeData.mode">
        <div class="theme-list-box">
          <div
            v-for="theme in themeList"
            :key="theme.key"
            class="theme-list__item"
            @click="themeData.mode = theme.key"
          >
            <img :src="theme.image" :alt="theme.title"/>
            <el-radio :label="theme.key">
              <span>{{ theme.title }}</span>
            </el-radio>
          </div>
        </div>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="主题颜色">
      <div class="theme-color-list">
        <div
          v-for="color in ThemeColors"
          :key="color"
          :style="{
            '--dbtu-theme-color': color
          }"
          class="theme-color__item"
          @click="themeData.color = color"
        >
          <el-icon
            v-if="color === themeData.color"
            :size="16"
            color="var(--el-color-white)"
          >
            <IconSelect/>
          </el-icon>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="字体大小">
      <el-slider
        non-passive
        v-model="themeData.fontSize"
        style="width: 330px; --el-slider-runway-bg-color: var(--dbtu-background-color)"
        :min="FONT_SIZE_MIN"
        :max="FONT_SIZE_MAX"
      />
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
.theme-list-box {
  display: flex;
  gap: 30px;
  flex-flow: wrap;

  .theme-list__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    img {
      border-radius: var(--dbtu-border-radius);
      pointer-events: none;
    }
  }
}

.theme-color-list {
  display: flex;
  gap: 20px;
  flex-flow: wrap;

  .theme-color__item {
    width: 30px;
    height: 30px;
    background-color: var(--dbtu-theme-color);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
