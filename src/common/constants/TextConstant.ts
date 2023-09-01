export const TextConstant = {
  /**
   * 确认删除描述信息
   *
   * @param text 删除的内容
   */
  deleteConfirm: (text: string): string => {
    return `你确定要删除 "${text}" 吗?`
  },

  confirm: (actionText: string, text: string): string => {
    return `你确定要${actionText} "${text}" 吗?`
  }
}
