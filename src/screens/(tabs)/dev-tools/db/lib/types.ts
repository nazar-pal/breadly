export type EntityType = 'table' | 'view'

export type DbEntity = {
  name: string
}

export type ColumnInfo = {
  name: string
  type?: string
  pk?: number
}

export type SortMode = 'default' | 'rows'
export type SortOrder = 'asc' | 'desc'

