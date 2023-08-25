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
  }
}
