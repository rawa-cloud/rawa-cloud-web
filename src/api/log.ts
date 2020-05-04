import { http, Pageable, Page } from '.'

export interface LogQueryReq extends Pageable{
  module?: string
  type?: string
  operateBy?: string
  operateTime: string[]
}

export interface LogQueryRes {
  id: number
  module: string
  type: string
  remark: string
  operateBy: string
  operateTime: string
}

export function queryLogs (req?: LogQueryReq) {
  return http().get<Page<LogQueryRes>>(`/logs`, { params: req })
}
