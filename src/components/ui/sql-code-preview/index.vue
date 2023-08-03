<!--
 * 代码预览组件
 *
 * @author Junpeng.Li
 * @date 2023-07-27 22:
-->
<script setup lang="ts">
import hljs from 'highlight.js'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'SqlCodePreviewComponent'
})

const props = defineProps({
  code: {
    type: String,
    required: true
  },

  // 是否自动换行
  autoWrap: {
    type: Boolean,
    default: true
  }
})
const codeHtml = computed(() => {
  return hljs.highlight(props.code, { language: 'sql' }).value
})

// code element dom of style
const codeDomStyle = computed(() => {
  return {
    'white-space': props.autoWrap ? 'pre-wrap' : 'pre'
  } as CSSProperties
})
</script>

<template>
  <div class="dbtu-code-preview">
    <el-scrollbar always>
      <pre class="pre-box">
        <code 
          ref="codeRef" 
          class="language-sql" 
          :style="codeDomStyle" 
          v-html="codeHtml"
        ></code>
      </pre>
    </el-scrollbar>
  </div>
</template>

<style lang="scss">
.dbtu-code-preview {
  width: 100%;
  height: 100%;
  padding: 10px 0;

  .pre-box {
    white-space: pre-line;
    line-height: 26px;
    padding: 0 10px;

    code {
      color: var(--dbtu-font-color);
      font-family: Consolas, 'Courier New', monospace;

      .hljs-built_in,
      .hljs-keyword,
      .hljs-name,
      .hljs-selector-tag,
      .hljs-tag {
        color: #0064ff;
      }

      .hljs-addition,
      .hljs-attribute,
      .hljs-literal,
      .hljs-section,
      .hljs-string,
      .hljs-template-tag,
      .hljs-template-variable,
      .hljs-title,
      .hljs-type {
        color: #af670a;
      }

      span {
        font-family: Consolas, 'Courier New', monospace;
      }
    }
  }
}
</style>
