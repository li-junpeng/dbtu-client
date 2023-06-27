export const ObjectUtils = {

  isEmpty(obj: object | null | undefined): boolean {
    return obj === null || obj === undefined || Object.keys(obj).length === 0
  },

  isNotEmpty(obj: object | null | undefined): boolean {
    return !ObjectUtils.isEmpty(obj)
  }

}
