export type PageChangeType = 'first' | 'prev' | 'next' | 'last' | 'input'

export interface PaginationProp {

  /**
   * 默认页码
   */
  current?: number

  /**
   * 修改页码
   *
   * @param currentPage 当前页
   * @param action      动作
   * @returns 最后一页的页码
   */
  changePage: (currentPage: number, action: PageChangeType) => Promise<number>
}
