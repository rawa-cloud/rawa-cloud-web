import Vue from 'vue'
import { Http } from '@pat-fet/web-vue-utils'

export function http (): Http {
  return Vue.prototype.$http
}

export interface Pageable {
  page: number
  size: number
  [key: string]: any
}

export interface Page<T> {
  number: number
  size: number
  content: T[]
  totalElements: number
}
