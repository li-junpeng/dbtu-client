// @ts-ignore
import { ElMessage, ElMessageBox, MessageBoxData } from 'element-plus'
// @ts-ignore
import type { Action, MessageBoxState } from 'element-plus/es/components/message-box/src/message-box.type'

export const MessageBox = {

  /**
   * 用来展示错误消息
   *
   * @param msg     消息内容
   * @param title   弹框标题
   */
  error: (
    msg: string,
    title: string = '错误'
  ): Promise<MessageBoxData> => {
    return ElMessageBox.alert(msg, title, {
      confirmButtonText: '确 定',
      type: 'error',
      autofocus: false,
      draggable: true,
      closeOnHashChange: true
    })
  },

  /**
   * 确认删除对话框
   *
   * @param msg     消息内容
   * @param fn      删除业务，业务执行完成后，需要手动调用`done()`关闭弹框
   * @param title   弹框标题
   */
  deleteConfirm: (
    msg: string,
    fn: (done: () => void) => void,
    title: string = '确认删除'
  ): Promise<MessageBoxData> => {
    return ElMessageBox.confirm(msg, title, {
      type: 'warning',
      cancelButtonClass: 'el-button--info',
      cancelButtonText: '取消',
      confirmButtonClass: 'el-button--danger',
      confirmButtonText: '删除',
      autofocus: false,
      draggable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      closeOnHashChange: true,
      // 点击【确定】后，将【确定】按钮改成加载状态
      beforeClose: (action: Action, instance: MessageBoxState, done: () => void) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          instance.confirmButtonText = '正在删除'
          fn(done)
        } else {
          done()
        }
      }
    })
  }

}

export const Message = {

  success: (msg: string) => {
    ElMessage({
      message: msg,
      type: 'success'
    })
  }

}
