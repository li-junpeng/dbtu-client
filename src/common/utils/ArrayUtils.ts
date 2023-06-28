export const ArrayUtils = {

  unshift<T extends []>(source: T[], obj: T): T[] {
    const array = JSON.parse(JSON.stringify(source))
    array.unshift(obj)
    return array
  }

}
