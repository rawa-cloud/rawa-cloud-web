import { http, Pageable, Page } from '.'

export interface FileLogQueryReq extends Pageable{
  fileId: number
}

export interface FileLogQueryRes {
  id: number
  fileId: string
  type: string
  typeDesc: string
  remark: string
  optBy: string
  optTime: string
}

export function queryFileLogs (req?: FileLogQueryReq) {
  return http().get<Page<FileLogQueryRes>>(`/fileLogs`, { params: req })
}
