import { http } from '.'

export interface LogQueryReq {
  [key: string]: any
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
  return http().get<LogQueryRes[]>(`/logs`, { params: req })
}
