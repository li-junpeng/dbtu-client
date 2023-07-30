export const ArrayUtils = {

  unshift<T extends []>(source: T[], obj: T): T[] {
    const array = JSON.parse(JSON.stringify(source))
    array.unshift(obj)
    return array
  },

  /**
   * 删除数组中的元素

   * @example
   * // 示例1： 普通数组
   * const array = [1, 2, 3, 4, 5]
   * // 结果为false
   * console.log(ArrayUtils.remove(array, 6))
   * // 结果为true
   * // 此时array = [1, 2, 4, 5]
   * console.log(ArrayUtils.remove(array, 3))
   *
   * // 示例2: 对象数组
   * const array = [
   *   {
   *     id: 1,
   *     name: '张三'
   *   },
   *   {
   *     id: 2,
   *     name: '李四'
   *   },
   *   {
   *     id: 3,
   *     name: '王五'
   *   }
   * ]
   * // 结果为false
   * console.log(ArrayUtils.remove(array, 4, 'id'))
   * // 结果为true, 此时array =
   * [
   *   {
   *     id: 1,
   *     name: '张三'
   *   },
   *   {
   *     id: 3,
   *     name: '王五'
   *   }
   * ]
   * console.log(ArrayUtils.remove(array, 2, 'id'))
   *
   * @param source    需要删除的数组
   * @param value     比较的值
   * @param field     做比较的字段名, 该字段必须要在source中存在, 如果source为非对象数组时，该参数为可选
   * @return 结果 true: 删除一个元素，false: 未匹配到元素
   */
  remove(source: any[], value: any, field?: string): boolean {
    if (!field) {
      const index = source.indexOf(value)
      if (index >= 0) {
        source.splice(index, 1)
        return true
      }
      return false
    } else {
      for (let i = 0; i < source.length; i++) {
        if (source[i][field] === value) {
          source.splice(i, 1)
          return true
        }
      }
      return false
    }
  }

}
