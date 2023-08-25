export const ArrayUtils = {
  /**
   * 数组是否为空
   *
   * @param data 要判断的数组
   * @returns  true: 空, false: 不为空
   */
  isEmpty(data: any[] | undefined | null): boolean {
    return !data || data.length === 0
  },

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
  },

  /**
   * 与Array.indexOf()类似，不过这个方法只针对对象数组，普通数组用Array.indexOf()就够用了
   *
   * @param source    数组
   * @param value     用来查找的值
   * @param field     做比较的字段，该字段必须要在source中存在
   */
  indexOf(source: any[], value: any, field: string): number {
    for (let i = 0; i < source.length; i++) {
      if (source[i][field] === value) {
        return i
      }
    }
    return -1
  },

  /**
   * 将指定项在数组内上移
   *
   * @param source 源数组
   * @param value  要移动的项
   * @param field  判断项是否相同所需要的字段, 如果该参数为空, 那么value参数应该是普通类型
   * @returns true: 移动成功, false: 移动失败
   */
  moveUp(source: any[], value: any, field?: string): boolean {
    if (this.isEmpty(source)) {
      return false
    }

    let index = -1
    if (!field) {
      index = source.indexOf(value)
    } else {
      index = this.indexOf(source, value[field], field)
    }
    if (index >= 1) {
      const beforeItem = source[index - 1]
      source[index] = beforeItem
      source[index - 1] = value
      return true
    }
    // index === 0, the value is first item or item is absent
    return false
  },

  /**
   * 将指定项在数组内下移
   *
   * @param source 源数组
   * @param value  要移动的项
   * @param field  判断项是否相同所需要的字段, 如果该参数为空, 那么value参数应该是普通类型
   * @returns true: 移动成功, false: 移动失败
   */
  moveDown(source: any[], value: any, field?: string): boolean {
    if (this.isEmpty(source)) {
      return false
    }

    let index = -1
    if (!field) {
      index = source.indexOf(value)
    } else {
      index = this.indexOf(source, value[field], field)
    }
    if (index < source.length - 1) {
      const afterItem = source[index + 1]
      source[index] = afterItem
      source[index + 1] = value
      return true
    }
    // 项不存在
    return false
  },

  /**、
   * js实现判断是不是数组
   */
  isArray(obj: any): boolean {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }
}
