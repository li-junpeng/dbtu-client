// @ts-ignore
import { ElMessageBox, MessageBoxData } from 'element-plus'

export const MessageBox = {

  error: (msg: string, title: string = '错误'): Promise<MessageBoxData> => {
    return ElMessageBox.alert(msg, title, {
      confirmButtonText: '确 定',
      type: 'error',
      autofocus: false,
      draggable: true
    })
  }

}
