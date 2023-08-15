/**
 * 重命名对话框通用组件
 * 
 * 适用于重名名、只有一个输入框等场景
 * 
 * @author Huayu
 * @date 2023-08-15 11:55
 */

import RenameDialog from './src/rename-dialog.vue'

export * from './src/rename-dialog'

export default RenameDialog

export type RenameDialogInstance = InstanceType<typeof RenameDialog>