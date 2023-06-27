export const ObjectUtils = {

  isEmpty(obj: object): boolean {
    return obj === null || Object.keys(obj).length === 0
  },

  isNotEmpty(obj: object): boolean {
    return !ObjectUtils.isEmpty(obj)
  }

}
