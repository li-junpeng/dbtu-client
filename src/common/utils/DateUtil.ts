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
    // 计算天数
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    ms %= 1000 * 60 * 60 * 24

    // 计算小时数
    const hours = Math.floor(ms / (1000 * 60 * 60))
    ms %= 1000 * 60 * 60

    // 计算分钟数
    const minutes = Math.floor(ms / (1000 * 60))
    ms %= 1000 * 60

    // 计算秒数
    const seconds = Math.floor(ms / 1000)
    ms %= 1000

    let str = ''
    if (ms > 0) {
      str = `${ms}毫秒`
    }
    if (seconds > 0) {
      str = `${seconds}秒 ${str}`
    }
    if (minutes > 0) {
      str = `${minutes}分钟 ${str}`
    }
    if (hours > 0) {
      str = `${hours}小时 ${str}`
    }
    if (days > 0) {
      str = `${days}天 ${str}`
    }
    return str
  }
}
