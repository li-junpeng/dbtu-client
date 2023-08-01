import { FileSizeUnit } from '@/common/constants/SystemConstant'

interface FormatFileSizeOption {
  /**
   * 保留小数位数
   *
   * @default 2
   */
  fractionDigits?: number
  /**
   * 数值与单位之间是否有空格
   *
   * @default true
   */
  isSpace?: boolean
  /**
   * 如果值为空，显示的值。default value is 0
   *
   * @default 0 KB
   * @example:
   * const num = null
   * const size = StringUtils.formatFileSize(num, {
   *   nullValue: '0 KB'
   * })
   * console.log(size) // size = 0 KB
   */
  nullValue?: string
}

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
  },

  /**
   * 将数值转换成可读的文件大小
   *
   * @param size      原始数值，单位: b
   * @param option    配置项
   */
  formatFileSize(size: number | null | undefined, option?: FormatFileSizeOption): string {
    const _option = {
      fractionDigits: 2,
      isSpace: true,
      nullValue: '0 KB',
      ...option
    }

    if (!size) {
      return _option.nullValue
    }

    const digitGroups = Math.floor(
      Math.min(FileSizeUnit.length - 1, Math.log10(size) / Math.log10(1024))
    )
    const value = (size / Math.pow(1024, digitGroups))
      .toFixed(_option.fractionDigits)
      .replace('.00', '')
    return value + (_option.isSpace ? ' ' : '') + FileSizeUnit[Math.floor(digitGroups)]
  },

  /**
   * 将驼峰字符串改为短横线
   *
   * @example
   * const str = 'UserName'
   * console.log(StringUtils.kebabCase2Line(str))   // user-name
   *
   * const str = 'userName'
   * console.log(StringUtils.kebabCase2Line(str))   // user-name
   *
   * @param str
   */
  kebabCase2Line(str: string): string {
    let s = str.replace(/[A-Z]/g, item => {
      return '-' + item.toLowerCase()
    })
    if (s.startsWith('-')) {
      s = s.slice(1)
    }
    return s
  }
}
