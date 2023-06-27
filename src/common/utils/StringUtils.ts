export const StringUtils = {

  NULL: 'null',

  UNDEFINED: 'undefined',

  isEmpty(str: string): boolean {
    return str === null || str === undefined || str === '' || str.length === 0
  },

  isNotEmpty(str: string): boolean {
    return !StringUtils.isEmpty(str)
  }

}
