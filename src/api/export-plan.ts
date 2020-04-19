import { http } from '.'

export interface ExportPlanRes {
  id: number

  startTime: string

  endTime: string

  execStatus: string

  execCount: string

  cron: string

  success: boolean

  remark: string

  status: string

  filePath: string

  exportFilePath: string
}

export interface ExportPlanAddReq {
  cron: string

  filePath: string
}

export function queryPlan () {
  return http().get<ExportPlanRes[]>(`/export-plans/active`).then(data => {
    return data ? [data] : []
  })
}

export function addPlan (req: ExportPlanAddReq) {
  return http().post<any>(`/export-plans`, req)
}

export function deletePlan () {
  return http().delete<any>(`/export-plans/active`)
}
