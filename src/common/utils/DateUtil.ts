export const DateUtil = {
  /**
   * 时间戳转成可读的时间字符串
   *
   * @param timestamp 时间戳
   * @returns yyyy-MM-dd HH:mm:ss 格式的时间
   */
  timestamp2Str(timestamp: number | string): string {
    return new Date(timestamp)
      .toLocaleString()
      .replace(/\//g, '-')
      .replace(/\b(\d)\b/g, '0$1')
  },

  /**
   * 毫秒转成秒或分钟或小时
   */
  ms2Str(ms: number): string {
    if (ms < 1000) {
      return `${ms} 毫秒`
    } else if (ms < 60 * 1000) {
      return `${ms / 1000} 秒`
    } else {
      const seconds = Math.floor(ms / 1000)
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      const remainingMilliseconds = ms % 1000
      let str = `${minutes} 分 `
      if (remainingSeconds > 0) {
        str += `${remainingSeconds} 秒 `
      }
      if (remainingMilliseconds > 0) {
        str += `${remainingMilliseconds} 毫秒`
      }
      return str
    }
    return ''
  }
}
