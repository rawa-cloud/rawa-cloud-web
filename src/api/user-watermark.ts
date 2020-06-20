import { http, Pageable, Page } from '.'

export function query (req: any) {
  return http().get<Page<any>>(`/user-watermarks`, { params: req })
}

export function add (req: any) {
  return http().post<number>(`/user-watermarks`, req)
}

export function update (id: number, req: any) {
  return http().put<any>(`/user-watermarks/${id}`, req)
}

export function del (id: number) {
  return http().delete<void>(`/user-watermarks/${id}`)
}
