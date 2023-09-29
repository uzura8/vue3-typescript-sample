import { Labels } from './Common'

export interface Category {
  cateId: number
  contentDiv: string
  labels: Labels
  slug: string
  orderNo: number
  parentId: number
  parentPath: string
  children?: Category[]
}
