import { http } from '.'

export interface LibraryCatalogAddReq {
  name: string
}

export interface LibraryCatalogFiledAddReq {
  name: string,
  type: string
  catalogId: number
}

export interface LibraryCatalogFiledDictAddReq {
  name: string,
  filedDefId: number
}

export interface LibraryCatalogUpdateReq {
  name: string
}

export interface LibraryCatalogFiledUpdateReq {
  name: string,
  type: string
}

export interface LibraryCatalogFiledDictUpdateReq {
  name: string,
}

export interface LibraryCatalogQueryRes {
  id: number
  name: string
  fieldDefs?: {
    name: string,
    type: string,
    parentId: number,
    typeDictList?: {
      name: string
      parentId: number
    }[]
  }
}

export function queryLibCatalogs () {
  return http().get<LibraryCatalogQueryRes[]>(`/libraries/catalogs`, { params: {} })
}

export function addLibCatalog (req: LibraryCatalogAddReq) {
  return http().post<number>(`/libraries/catalogs`, req)
}

export function addLibCatalogField (req: LibraryCatalogFiledAddReq) {
  return http().post<number>(`/libraries/catalog/fields`, req)
}

export function addLibCatalogFieldDict (req: LibraryCatalogFiledDictAddReq) {
  return http().post<number>(`/libraries/catalog/field/dicts`, req)
}

export function updateLibCatalog (id: number, req: LibraryCatalogUpdateReq) {
  return http().put<number>(`/libraries/catalogs/${id}`, req)
}

export function updateLibCatalogField (id: number, req: LibraryCatalogFiledUpdateReq) {
  return http().put<number>(`/libraries/catalog/fields/${id}`, req)
}

export function updateLibCatalogFieldDict (id: number, req: LibraryCatalogFiledDictUpdateReq) {
  return http().put<number>(`/libraries/catalog/field/dicts/${id}`, req)
}

export function deleteLibCatalog (id: number) {
  return http().delete<number>(`/libraries/catalogs/${id}`)
}

export function deleteLibCatalogField (id: number) {
  return http().delete<number>(`/libraries/catalog/fields/${id}`)
}

export function deleteLibCatalogFieldDict (id: number) {
  return http().delete<number>(`/libraries/catalog/field/dicts/${id}`)
}
