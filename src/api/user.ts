import { http } from '.'

export interface UserQueryReq {
  username?: string
  cname?: string
  deptId?: number | null
  status?: boolean | null
}

export interface UserQueryRes {
  id: number
  username: string
  cname: string
  deptId: number
  ip?: string
  status: boolean
  deptName: string
  roles: number[]
  files: number[]
}

export interface UserAddReq {
  username: string
  cname: string
  ip?: string
  deptId: number
  roles: number[]
  files: number[]
}

export interface UserUpdateReq {
  cname: string
  ip?: string
  deptId: number
  status: boolean
  roles?: number[]
  files?: number[]
}

export interface UserRes {
  id: number
  username: string
  cname: string
  deptId: number
  ip?: string
  status: boolean
  deptName: string
  roles: number[]
  files: number[]
}

export function queryUsers (req: UserQueryReq) {
  return http().get<UserQueryRes[]>(`/users`, { params: req })
}

export function addUser (req: UserAddReq) {
  return http().post<number>(`/users`, req)
}

export function patchUser (id: number, req: UserUpdateReq) {
  return http().put<void>(`/users/${id}`, req)
}

export function getUser (id: number) {
  return http().get<UserRes>(`/users/${id}`)
}

export function deleteUser (id: number) {
  return http().delete<void>(`/users/${id}`)
}
