/**
 * 提交内容对话框通用组件
 * 
 * 适用于重名名、只有一个输入框等场景
 * 
 * @author Huayu
 * @date 2023-08-15 11:55
 */

import PromptDialog from './src/prompt-dialog.vue'

export * from './src/prompt-dialog'

export default PromptDialog

export type PromptDialogInstance = InstanceType<typeof PromptDialog>