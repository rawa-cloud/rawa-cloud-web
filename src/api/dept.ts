import { http } from '.'

export interface DeptQueryReq {
  name?: string
  parentId?: number
}

export interface DeptQueryRes {
  id: number
  name: string
  parentId?: number
}

export interface DeptAddReq {
  name: string
  parentId: number
}

export interface DeptUpdateReq {
  name: string
  parentId: number
}

export interface DeptRes {
  id: number
  name: string
  parentId?: number
}

export function queryDepts (req: DeptQueryReq) {
  return http().get<DeptQueryRes[]>(`/depts`, { params: req })
}

export function addDept (req: DeptAddReq) {
  return http().post<number>(`/depts`, req)
}

export function updateDept (id: number, req: DeptUpdateReq) {
  return http().put<void>(`/depts/${id}`, req)
}

export function getDept (id: number) {
  return http().get<DeptRes>(`/depts/${id}`)
}

export function deleteDept (id: number) {
  return http().delete<void>(`/depts/${id}`)
}
