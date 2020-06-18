import { http } from '.'

export function add (req: any) {
  return http().post<number>(`/watermarks`, req)
}

export function update (id: number, req: any) {
  return http().put<void>(`/watermarks/${id}`, req)
}

export function query () {
  return http().get<any[]>(`/watermarks`)
}

export function del (id: number) {
  return http().delete<void>(`/watermarks/${id}`)
}
