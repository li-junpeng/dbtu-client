import { ElMessage, ElMessageBox } from 'element-plus'
import type { MessageBoxData } from 'element-plus'
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
      confirmButtonText: '确定',
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
    return MessageBox.confirm({
      msg,
      title,
      confirmText: '删除',
      useLoading: true,
      loadingText: '正在删除'
    }, fn)
  },

  confirm: (
    option: {
      msg: string,
      title?: string,
      confirmText?: string,
      useLoading?: boolean,
      loadingText?: string
    },
    fn: (done: () => void) => void,
  ): Promise<MessageBoxData> => {
    return ElMessageBox.confirm(option.msg, option.title || '警告', {
      type: 'warning',
      cancelButtonClass: 'el-button--info',
      cancelButtonText: '取消',
      confirmButtonClass: 'el-button--danger',
      confirmButtonText: option.confirmText || '确定',
      autofocus: false,
      draggable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      closeOnHashChange: true,
      // 点击【确定】后，将【确定】按钮改成加载状态
      beforeClose: (action: Action, instance: MessageBoxState, done: () => void) => {
        if (!option.useLoading) {
          return
        }

        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          instance.confirmButtonText = option.loadingText || '正在处理'
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
