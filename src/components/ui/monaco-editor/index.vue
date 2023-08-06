<!--
 * monaco编辑器
 *
 * @author Junpeng.Li
 * @date 2023-07-25 10-02
-->
<script setup lang="ts">
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { debounce } from 'lodash'
import {
  type MonacoEditorEmits,
  type MonacoEditorProp,
  MonacoEditorPropDefault
} from '@/components/ui/monaco-editor/define'
import { useDark } from '@vueuse/core'
import { useSystemSettingStore } from '@/stores/SystemSettingStore'
;(self as any).MonacoEnvironment = {
  getWorker(_: any, label: any) {
    return new EditorWorker()
  }
}

const props = withDefaults(defineProps<MonacoEditorProp>(), MonacoEditorPropDefault)
const emits = defineEmits<MonacoEditorEmits>()
const containerRef = ref<HTMLDivElement>()
let editor = {} as ReturnType<typeof monaco.editor.create>
const modelValue = defineModel<string>({
  required: true
})

// region editor theme start //
// 注册编辑器主题
const systemSettingStore = useSystemSettingStore()
const isDark = useDark()
const registerTheme = () => {
  const computedStyle = getComputedStyle(document.body)
  const { mode } = systemSettingStore.getSetting().theme
  const baseTheme = () => {
    if (mode === 'auto') {
      return isDark.value ? 'vs-dark' : 'vs'
    }
    return mode === 'dark' ? 'vs-dark' : 'vs'
  }

  console.log(baseTheme())

  console.log({
    bacolor: computedStyle.getPropertyValue('--dbtu-background-color'),
    fontcolor: computedStyle.getPropertyValue('--dbtu-font-color')
  })

  monaco.editor.defineTheme('dbtu-theme', {
    rules: [],
    base: baseTheme(),
    inherit: true,
    colors: {
      'editor.background': computedStyle.getPropertyValue('--dbtu-background-color'),
      'editor.lineHighlightBackground': computedStyle.getPropertyValue('--dbtu-hover-color'),
      'editorLineNumber.foreground': computedStyle.getPropertyValue('--dbtu-font-color'),
      'editorCursor.foreground': computedStyle.getPropertyValue('--dbtu-font-color')
      // 'editorGutter.background': computedStyle.getPropertyValue('--dbtu-hover-color')
    }
  })
}
// 监听主题变化
watch(
  () => [isDark, systemSettingStore.getSetting().theme],
  () => {
    // fix: 当系统主题默认为'跟随系统'时, 此时选择浅色、然后选择深色, 部分css变量错误的问题
    nextTick(() => {
      registerTheme()
      monaco.editor.setTheme('dbtu-theme')
    })
  },
  { deep: true }
)
// endregion editor theme end //

const initEditor = () => {
  editor = monaco.editor.create(containerRef.value!, {
    // 官方自带三种主题vs, hc-black, or vs-dark
    theme: 'vs',
    value: modelValue.value, //编辑器初始显示文字
    readOnly: props.readonly,
    readOnlyMessage: {
      value: '不允许编辑'
    },
    lineNumbers: props.lineNumbers,
    // 通过保留用于呈现至少一定数量的数字的水平空间来控制行号的宽度。默认值为5。
    lineNumbersMinChars: 3,
    // 为线条装饰保留的宽度（以px为单位）。线条装饰被放置在行号和编辑器内容之间。
    // 您可以传入一个字符串，格式为浮点，后跟“ch”。例如1.3ch。默认值为10。
    lineDecorationsWidth: 7,
    language: props.language,
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
    cursorSmoothCaretAnimation: 'off',
    // 平滑滚动
    smoothScrolling: true,
    automaticLayout: true,
    // 自动换行
    wordWrap: props.wordWrap,
    /*padding: {
      top: 10,
      bottom: 10
    },*/
    // 代码折叠
    folding: props.folding,
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
    letterSpacing: 1,
    renderLineHighlightOnlyWhenFocus: true
  })
  // 动态修改主题
  monaco.editor.setTheme('dbtu-theme')

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

watch(
  () => modelValue,
  debounce(() => {
    // 因为设置了新的值后，焦点会回到最前面，所以要记录一下设置值之前的焦点位置
    const position = editor.getPosition()
    editor.setValue(modelValue.value)
    // 恢复设置值之前的焦点位置
    position && editor.setPosition(position)
  }, 300),
  { deep: true }
)

onMounted(() => {
  registerTheme()
  initEditor()
})

onUnmounted(() => {
  editor.dispose()
})
</script>

<template>
  <div
    ref="containerRef"
    style="width: 100%; height: 100%"
  ></div>
</template>

<style scoped lang="scss"></style>
