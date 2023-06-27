export const StringUtils = {

  NULL: 'null',

  UNDEFINED: 'undefined',

  isEmpty(str: string | null | undefined): boolean {
    return str === null || str === undefined || str === '' || str.length === 0
  },

  isNotEmpty(str: string | null | undefined): boolean {
    return !StringUtils.isEmpty(str)
  }

}
