import { http } from '.'

export interface FileQueryReq {
  parentId: number

  dir?: boolean
}

export interface FileQueryRes {
  id: number

  parentId?: number

  dir: boolean

  name: string

  contentType?: string

  size?: number

  uuid?: string

  creationBy: string

  creationTime: string

  lastChangeBy: string

  lastChangeTime: string

  status: boolean

  limitSize?: number

  limitSuffix?: string

  userId?: number
}

export interface FileAddReq {

  parentId: number

  dir: boolean

  name: string

  uuid?: string

  limitSize?: number

  limitSuffix?: string
}

export interface FilePatchReq {

  name?: string

  uuid?: string

  limitSize?: string

  limitSuffix?: string

  remark?: string
}

export interface FileRes {
  id: number

  parentId?: number

  dir: boolean

  name: string

  contentType?: string

  size?: number

  uuid?: string

  creationBy: string

  creationTime: string

  lastChangeBy: string

  lastChangeTime: string

  status: boolean

  limitSize?: number

  limitSuffix?: string

  userId?: number

  parent?: FileRes
}

export function queryFiles (req: FileQueryReq) {
  return http().get<FileQueryRes[]>(`/files`, { params: req })
}

export function addFile (req: FileAddReq) {
  return http().post<number>(`/files`, req)
}

export function patchFile (id: number, req: FilePatchReq) {
  return http().patch<void>(`/files/${id}`, req)
}

export function getFile (id: number) {
  return http().get<FileRes>(`/files/${id}`)
}

export function rename (id: number, name: string) {
  return http().put<any>(`/files/${id}/rename`, { name })
}

export function getFileRecords (id: number) {
  return http().get<any[]>(`/files/${id}/records`)
}

export function deleteFiles (ids: number[]) {
  return http().delete<void>(`/files/batch/${ids.join(',')}`)
}

export function updateFileContent (id: number, req: {uuid: string, remark?: string}) {
  return http().put<number>(`/files/${id}/update`, req)
}

export function downloadFile (id: number) {
  return http().get<Blob>(`/files/download/${id}`, { responseType: 'blob' })
}

export function previewFile (id: number) {
  return http().get<Blob>(`/files/${id}/preview`, { responseType: 'blob' })
}

export function getRootFile () {
  return http().get<FileRes>(`/files/file/root`)
}

export function getUserRootFile () {
  return http().get<FileRes>(`/files/file/user-root`)
}
