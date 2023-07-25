<!--
 * monaco编辑器
 *
 * @author Junpeng.Li
 * @date 2023-07-25 10-02
-->
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import * as monaco from 'monaco-editor'
import { debounce } from 'lodash'
import type { MonacoEditorEmits } from '@/components/ui/monaco-editor/define'

const containerRef = ref<HTMLDivElement>()
let editor = {} as ReturnType<typeof monaco.editor.create>
const modelValue = defineModel<string>({
  required: true
})
const registerTheme = () => {
  monaco.editor.defineTheme('dbtu-theme-light', {
    rules: [],
    base: 'vs',
    inherit: true,
    colors: {
      'editor.background': '#f2f2f2',
      'editor.lineHighlightBackground': '#eaeaea',
      'editorLineNumber.foreground': '#606266',
      'editorCursor.foreground': '#606266'
    }
  })
}

const emits = defineEmits<MonacoEditorEmits>()

const initEditor = () => {
  editor = monaco.editor.create(containerRef.value!, {
    // 官方自带三种主题vs, hc-black, or vs-dark
    theme: 'vs',
    value: modelValue.value, //编辑器初始显示文字
    readOnly: true,
    readOnlyMessage: {
      value: '不允许编辑'
    },
    lineNumbers: 'off',
    // 通过保留用于呈现至少一定数量的数字的水平空间来控制行号的宽度。默认值为5。
    lineNumbersMinChars: 3,
    // 为线条装饰保留的宽度（以px为单位）。线条装饰被放置在行号和编辑器内容之间。
    // 您可以传入一个字符串，格式为浮点，后跟“ch”。例如1.3ch。默认值为10。
    lineDecorationsWidth: 7,
    language: 'sql',
    roundedSelection: false,
    contextmenu: false,
    scrollBeyondLastLine: false,
    scrollbar: {
      useShadows: true,
      verticalHasArrows: false,
      horizontalHasArrows: false,
      horizontalScrollbarSize: 0,
      verticalScrollbarSize: 0,
      horizontalSliderSize: 12,
      verticalSliderSize: 12
    },
    minimap: {
      enabled: false
    },
    // 平滑输入字符
    cursorSmoothCaretAnimation: 'on',
    // 平滑滚动
    smoothScrolling: true,
    automaticLayout: true,
    // 自动换行
    wordWrap: 'on',
    /*padding: {
      top: 10,
      bottom: 10
    },*/
    // 代码折叠
    folding: false,
    fixedOverflowWidgets: true,
    formatOnPaste: true,
    formatOnType: true,
    insertSpaces: true,
    lineHeight: 26,
    quickSuggestions: false,
    snippetSuggestions: 'none',
    tabSize: 4,
    wordBasedSuggestions: false,
    autoIndent: 'advanced',
    glyphMargin: false,
    renderLineHighlight: 'line',
    renderWhitespace: 'none',
    scrollBeyondLastColumn: 2,
    letterSpacing: 1
  })
  // 动态修改主题
  monaco.editor.setTheme('dbtu-theme-light')

  // 监听内容变化
  editor.onDidChangeModelContent(() => {
    modelValue.value = editor.getValue()
    emits('change-text', editor.getValue())
  })

  // 失去焦点事件
  editor.onDidBlurEditorText(() => {
    emits('editor-blur')
  })
}

watch(() => modelValue, debounce(() => {
  // 因为设置了新的值后，焦点会回到最前面，所以要记录一下设置值之前的焦点位置
  const position = editor.getPosition()
  editor.setValue(modelValue.value)
  // 恢复设置值之前的焦点位置
  position && editor.setPosition(position)
}, 300), { deep: true })

onMounted(() => {
  registerTheme()
  initEditor()
})
</script>

<template>
  <div
    ref="containerRef"
    style="width: 100%;height: 100%;"
  ></div>
</template>

<style scoped lang="scss">

</style>
