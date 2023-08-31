import { ArrayUtils } from '@/common/utils/ArrayUtils'
import dayjs from 'dayjs'

export type DataGridColumn = {
  /**
   * 字段的key
   */
  key: string

  /**
   * 字段的名称
   */
  label: string

  /**
   * 数据类型
   */
  dataType: DbDataType
}

export interface DataGridProp {
  /**
   * 表的列
   */
  columns: DataGridColumn[]

  /**
   * 表格数据
   */
  data: any[]

  /**
   * 是否显示序号列
   *
   * @default true
   */
  indexColumn?: boolean

  /**
   * 序号列的标题
   *
   * @default ''
   */
  indexColumnTitle?: string

  /**
   * 是否自动添加无数据时的空行
   *
   * @default true
   */
  appendNoneData?: boolean

  /**
   * 无数据时空行中的列默认显示的值
   *
   * @default (N/A)
   */
  noneDataValue?: string
}

/**
 * 根据数据类型决定值的对齐方式
 *
 * @param dataType 数据类型
 * @returns 对齐方式
 */
export const getAlignByDataType = (dataType: DbDataType): 'left' | 'center' | 'right' => {
  switch (dataType) {
    case 'number':
      return 'right'
    default:
      return 'left'
  }
}

export const getColumnWidth = (dataType: DbDataType): number => {
  // TODO enum 和 set是错误的
  switch (dataType) {
    case 'string':
      return 200
    case 'datetime':
      return 190
    case 'enum':
      return 100
    default:
      return 150
  }
}

/**
 * 根据数据类型解析值
 *
 * @param cellData 列的值
 * @param column   列信息
 * @returns 值
 */
export const parseValue = (cellData: any, column: DataGridColumn): string => {
  switch (column.dataType) {
    case 'datetime':
      // fix: 日期显示错误的BUG, issues#3
      if (ArrayUtils.isArray(cellData) && cellData.length >= 5) {
        return dayjs(`${cellData[0]}-${cellData[1]}-${cellData[2]} ${cellData[3]}:${cellData[4]}:${cellData[5] || 0}`).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      }
      const str = dayjs(cellData).format('YYYY-MM-DD HH:mm:ss')
      return str === 'Invalid Date' ? cellData || '0000-00-00 00:00:00' : str
    case 'date':
      return dayjs('2023-08-25 00:00:00').format('YYYY-MM-DD')
    default:
      return cellData
  }
}
