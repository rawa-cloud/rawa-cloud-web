import { http } from '.'
import { getAuthorities } from '@/common/resource'
import store from '@/store'

export interface LoginReq {
    username: string
    password: string
}

export interface LoginRes {
    token?: string
}

export interface ChangePasswordReq {
    oldPassword: string
    newPassword: string
}

export function login (req: LoginReq) {
  return http().post<LoginRes>(`/login`, null, { params: req })
}

export function logout () {
  return http().delete(`/logout`)
}

export function loadPrinciple () {
  const all = [http().get<any>(`/auth/principle`), loadDict(), loadUsers()]
  return Promise.all(all).then(([v, dicts = [], users = []]) => {
    store.commit('dict/setItems', [...users, ...dicts])
    const roles = (v.roles || []).map((v: any) => ({ code: v }))
    const authorities = getAuthorities(roles.map((w: any) => w.code))
    return Object.assign(v, { roles }, { authorities })
  })

  function loadDict () {
    return http().get<any>(`/dicts`)
  }

  function loadUsers () {
    return http().get<any>('/users').then(data => {
      return (data || []).map((v: any) => {
        return {
          name: 'user',
          code: v.username,
          label: v.cname,
          status: v.status
        }
      })
    })
  }
}

export function changePassword (req: ChangePasswordReq) {
  return http().put(`/auth/password`, req)
}
