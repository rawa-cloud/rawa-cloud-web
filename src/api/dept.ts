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

export interface DeptAuthority {
  id: number
  deptId: number
  fileId: number
  isDir: boolean
  umask: number
  validDays?: number
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

export function getDeptAuthorities (id: number) {
  return http().get<DeptAuthority[]>(`/depts/${id}/authorities`)
}

export function addDeptAuthority (id: number, fileId: number, umask: number, validDays?: number) {
  const req = {
    principleId: id,
    fileId,
    umask,
    validDays
  }
  return http().post<number>(`/depts/${id}/authorities`, req)
}

export function deleteDeptAuthorities (id: number, ids: number[]) {
  return http().delete<number>(`/depts/${id}/authorities`, { params: { ids: ids.join(',') } })
}
