<!--
 * 动态dialog
 *
 * @author Junpeng.Li
 * @date 2023-07-24 14-49
-->
<script setup lang="ts">
import { type FooterButton, useDynamicDialogStore } from '@/stores/DynamicDialogStore'

defineOptions({
  name: 'DynamicDialogComponent'
})

const comRef = ref()
const dynamicDialogStore = useDynamicDialogStore()

const onClickButton = async (button: FooterButton) => {
  if (button.enableLoading) {
    button.loading = true
  }
  button.onClick().finally(() => {
    button.loading = false
  })
}

onMounted(() => {
  dynamicDialogStore.ref = comRef
})
</script>

<template>
  <el-dialog
    v-model="dynamicDialogStore.visible"
    :title="dynamicDialogStore.title"
    :width="dynamicDialogStore.width"
    :close-on-click-modal="false"
    :append-to-body="dynamicDialogStore.appendToBody"
    :modal-class="dynamicDialogStore.modalClass"
    draggable
    destroy-on-close
  >
    <component
      ref="comRef"
      :is="dynamicDialogStore.component"
    />

    <template
      v-if="dynamicDialogStore.footerButtons.length >= 1"
      #footer
    >
      <el-button
        v-for="button in dynamicDialogStore.footerButtons"
        :key="button.text"
        :type="button.type"
        :loading="button.loading"
        :disabled="button.disabled"
        @click="onClickButton(button)"
      >
        <span>{{ button.loading ? button.loadingText || '正在处理' : button.text }}</span>
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
