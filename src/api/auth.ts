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
  // eslint-disable-next-line no-useless-escape
  const user = (location.href.match(/[\?&]user=([^&]+)/) || [])[1]
  const handler = () => {
    const all = [http().get<any>(`/auth/principle`), loadDepts(), loadKeyUnit(), loadAreas(), loadUsers()]
    return Promise.all(all).then(([v, depts = [], units = [], areas = [], users = []]) => {
      store.commit('dict/setItems', [...users, ...depts, ...units, ...areas])
      const roles = (v.roles || []).map((v: any) => ({ code: v }))
      const authorities = getAuthorities(roles.map((w: any) => w.code))
      return Object.assign(v, { roles }, { authorities })
    })
  }

  if (user) {
    return login({ username: `user:${user}`, password: '********' }).then(() => {
      return handler()
    }).catch(() => {
      window.location.hash = `#/login`
      window.location.reload()
    })
  } else {
    return handler()
  }

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
          status: v.status,
          data: v
        }
      })
    })
  }

  function loadDepts () {
    return http().get<any>('/depts').then(data => {
      return (data || []).map((v: any) => {
        return {
          name: 'unit',
          code: v.code,
          label: v.name,
          status: true,
          data: v
        }
      })
    })
  }

  function loadKeyUnit () {
    return http().get<any>('/units').then(data => {
      return (data || []).map((v: any) => {
        return {
          name: 'keyUnit',
          code: v.code,
          label: v.name,
          status: true,
          data: v
        }
      })
    })
  }

  function loadAreas () {
    return http().get<any>('/areas').then(data => {
      return (data || []).map((v: any) => {
        return {
          name: 'location',
          code: v.code,
          label: v.name,
          status: true,
          data: v
        }
      })
    })
  }
}

export function changePassword (req: ChangePasswordReq) {
  return http().put(`/auth/password`, req)
}
