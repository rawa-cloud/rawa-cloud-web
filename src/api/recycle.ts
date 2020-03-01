import { http, Pageable } from '.'
import { Page } from './index'

export interface RecycleQueryReq extends Pageable{
    // creationBy?: string
}

export interface RecycleQueryRes {
    id: number
    creationBy: string,
    creationTime: string,
    file: any
}

export interface RecycleAddReq {
    fileId: number
}

export interface RecycleAddInBatchReq {
  files: number[]
}

export interface RecycleRes {
    id: number
    creationBy: string,
    creationTime: string,
    file: any
}

export function queryRecycles (req: RecycleQueryReq) {
  return http().get <Page<RecycleQueryRes>>(`/recycles`, { params: req })
}

export function addRecycle (req: RecycleAddReq) {
  return http().post<number>(`/recycles`, req)
}

export function addRecycles (req: RecycleAddInBatchReq) {
  return http().post<number[]>(`/recycles/batch`, req)
}

export function getRecycle (id: number) {
  return http().get<RecycleRes>(`/recycles/${id}`)
}

// 批量删除
export function deleteRecycles (ids: number[]) {
  const d = ids.join(',')
  return http().delete<void>(`/recycles/batch/${d}`)
}

// 批量恢复
export function recoverRecycles (ids: number[]) {
  const d = ids.join(',')
  return http().delete<void>(`/recycles/batch/recover/${d}`)
}

export function clearRecycle () {
  return http().delete<void>(`/recycles/clear`)
}
