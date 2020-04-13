import { http, Pageable, Page } from '.'

export interface License extends Pageable{
  text: string
  mac: string
  expiredDate: string
  limitUser: number
  free: boolean
}

export function getLicense () {
  return http().get<Array<License>>(`/license`)
}

export function updateLicense (text: string) {
  return http().post<any>(`/license`, { text })
}
