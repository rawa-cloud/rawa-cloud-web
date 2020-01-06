import { http } from '.'

export interface CatalogAddReq {
  name: string
}

export interface CatalogItemReq {
  name: string

  catalogId: number

  fileId: number

  remark?: string
}

export interface Catalog {
  name: string
}

export interface Item {
  name: string
  remark: string
}

export function queryCatalogs () {
  return http().get<Catalog[]>('/favorites/user/catalogs')
}

export function addCatalog (req: CatalogAddReq) {
  return http().post<number>('/favorites/user/catalogs', req)
}

export function deleteCatalog (id: number) {
  return http().delete<any>(`/favorites/user/catalogs/${id}`)
}

export function queryItems (catalogId: number) {
  return http().get<Item[]>('/favorites/user/items', { params: { catalogId } })
}

export function addItem (req: CatalogItemReq) {
  return http().post<number>('/favorites/user/items', req)
}

export function deleteItem (id: number) {
  return http().delete<any>(`/favorites/user/items/${id}`)
}
