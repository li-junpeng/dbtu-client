<!--
 * 测试`dom-resizer`指令
 *
 * @author HuaYu
 * @date 2023-08-30 10:34
-->
<script setup lang="ts">
import vResizer from '.'

defineOptions({
  name: 'DomResizerTest'
})

const div1 = ref(true)
const div2 = ref(true)
const div3 = ref(true)
const div4 = ref(true)
</script>

<template>
  <button @click="div1 = !div1">div1</button>
  <button @click="div2 = !div2">div2</button>
  <button @click="div3 = !div3">div3</button>
  <button @click="div4 = !div4">div4</button>

  <div style="width: 100%; height: 91%; padding: 100px; display: flex; gap: 30px">
    <div
      v-if="div1"
      class="div-box"
      style=""
      v-resizer="{
        position: 'left'
      }"
    >
      div1
    </div>
    <div
      v-if="div2"
      class="div-box"
      style=""
      v-resizer="{
        position: 'right'
      }"
    >
      div2
    </div>
    <div
      v-if="div3"
      class="div-box"
      style=""
      v-resizer="{
        position: 'top'
      }"
    >
      div3
    </div>
    <div
      v-if="div4"
      class="div-box"
      style=""
      v-resizer="{
        position: 'bottom'
      }"
    >
      div4
    </div>
  </div>
</template>

<style scoped lang="scss">
button {
  width: 100px;
  height: 34px;
  margin: 20px;
}

.div-box {
  width: 200px;
  height: 200px;
  position: relative;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
