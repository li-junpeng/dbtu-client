export const StringUtils = {

  NULL: 'null',

  // 没有值时显示的内容
  NULL_SHOW_VALUE: '--',

  UNDEFINED: 'undefined',

  isEmpty(str: string | null | undefined): boolean {
    return str === null || str === undefined || str === '' || str.length === 0
  },

  isNotEmpty(str: string | null | undefined): boolean {
    return !StringUtils.isEmpty(str)
  }

}
