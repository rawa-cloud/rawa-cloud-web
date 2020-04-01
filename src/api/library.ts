import { http, Pageable, Page } from '.'

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

export interface LibraryQueryReq extends Pageable {
  catalogId: number
  name?: string
}

export interface LibraryAddReq {
  catalogId: number
  // name: string
}

export interface LibraryUpdateReq {
  name: string
}

export interface LibraryQueryRes {
  id: number
  name: string
  catalogId: number
  fields: {
    name: string
    type: string
    fieldDefId: number
    value?: string
    options?: {
      name: string
    }[]
  }[]
  [key: string]: any
}

export interface LibraryCatalogQueryRes {
  id: number
  name: string
  fieldDefs?: {
    name: string,
    type: string,
    typeDictList?: {
      name: string
      parentId: number
    }[]
  }
}

export function queryLibCatalogs () {
  return http().get<LibraryCatalogQueryRes[]>(`/libraries/catalogs`, { params: {} })
}

export function queryLibCatalog (id: number) {
  return http().get<LibraryCatalogQueryRes>(`/libraries/catalogs/${id}`, { params: {} })
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

export function updateLibraryCatalogAuthorities (id: number, req: { username: string, opt: string }[]) {
  return http().post<any>(`/libraries/catalogs/${id}/authorities`, req)
}

// Library

export function queryLibraries (params: LibraryQueryReq) {
  return http().post<Page<LibraryQueryRes>>(`/libraries/query`, params)
}

export function addLibrary (req: LibraryAddReq) {
  return http().post<number>(`/libraries`, req)
}

export function updateLibrary (id: number, req: LibraryUpdateReq) {
  return http().put<any>(`/libraries/${id}`, req)
}

export function deleteLibrary (id: number) {
  return http().delete<any>(`/libraries/${id}`)
}

export function updateLibraryFields (id: number, req: { fieldDefId: number, value: string }[]) {
  return http().post<number>(`/libraries/${id}/fields`, req)
}

export function addLibraryFile (id: number, fileId: number) {
  return http().post<any>(`/libraries/${id}/file/${fileId}`)
}

export function updateLibraryAuthorities (id: number, req: { username: string, opt: string }[]) {
  return http().post<any>(`/libraries/${id}/authorities`, req)
}

export function downloadFileForLibrary (id: number) {
  return http().get<Blob>(`/libraries/${id}/download`, { responseType: 'blob' })
}

export function previewFileForLibrary (id: number) {
  return http().get<Blob>(`/libraries/${id}/preview`, { responseType: 'blob' })
}
