<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElIcon } from 'element-plus'
import DefaultAvatarImg from '@/assets/images/avatars/avatar-30.png'
// icons
import IconSetting from '@/icons/svg/setting.vue'
import IconApplication from '@/icons/svg/application.vue'
import IconGithub from '@/icons/svg/app-github.vue'
import IconNotify from '@/icons/svg/notify.vue'
// store
import { useUserInfoStore } from '@/stores/UserInfoStore'
// 组件
import SystemSettingDialog from '@/components/system-setting/index.vue'

defineOptions({
  name: 'PageHeader'
})

// 当前登录用户信息
const userStore = useUserInfoStore()
const user = computed(() => {
  return userStore.getCurrent()
})
const userAvatar = computed(() => {
  return user.value ? user.value?.avatar : DefaultAvatarImg
})

/**
 * 打开登录对话框
 */
const toLogin = () => {
  // TODO 登录对话框
  // userStore.user.avatar = 'https://himg.bdimg.com/sys/portraitn/item/public.1.d15d503.gXcNg-Jk2k_k8sFtxRYr4w'
}

// 系统设置对话框实例
const systemSettingDialogRef = ref()
const openSystemSettingDialog = () => {
  systemSettingDialogRef.value?.onOpen()
}
</script>

<template>
  <div class="page-header">
    <div class="left-box">DB兔，稳而快</div>
    <div class="dbtu-un-user-select right-box">
      <!-- 当前登录用户信息 -->
      <div class="right-box__item user-avatar-box">
        <div
          v-if="!user"
          class="un-login-user"
          @click="toLogin()"
        >
          <span>请登录</span>
        </div>
        <img
          v-else
          :src="userAvatar"
          class="user-avatar-image"
          alt="用户头像"
        />
      </div>

      <!-- 只有用户登录以后才能看到消息 -->
      <div
        v-if="user"
        class="right-box__item"
      >
        <el-icon :size="18">
          <IconNotify/>
        </el-icon>
        <span>消息</span>
      </div>

      <div
        class="right-box__item"
        @click="openSystemSettingDialog"
      >
        <el-icon :size="18">
          <IconSetting/>
        </el-icon>
        <span>设置</span>
      </div>

      <div class="right-box__item">
        <el-icon :size="16">
          <IconApplication/>
        </el-icon>
        <span>应用商店</span>
      </div>

      <div class="right-box__item">
        <el-icon :size="17">
          <IconGithub/>
        </el-icon>
        <a href="https://github.com/li-junpeng/dbtu-client" target="_blank">GitHub，点个Star</a>
      </div>

    </div>
  </div>

  <system-setting-dialog ref="systemSettingDialogRef"/>
</template>

<style lang="scss" scoped>
$avatar-image-size: 30px;

.page-header {
  width: 100%;
  height: 60px;
  border-bottom: 1px solid var(--dbtu-background-color-dark);
  color: var(--dbtu-font-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;

  .right-box {
    display: flex;
    flex-direction: row-reverse;
    gap: 30px;

    .user-avatar-box {
      display: flex;
      align-items: center;

      .un-login-user {
        cursor: pointer;
      }

      .user-avatar-image {
        border-radius: 50%;
        width: $avatar-image-size;
        height: $avatar-image-size;
        cursor: pointer;
      }
    }

    .right-box__item {
      display: flex;
      align-items: center;
      cursor: pointer;
      gap: 5px;

      &:hover {
        color: var(--dbtu-font-color-light);
      }
    }
  }
}
</style>
