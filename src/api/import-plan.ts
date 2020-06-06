import { http } from '.'

export interface ImportPlanRes {
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

  parentFilePath: string
}

export interface ImportPlanAddReq {
  cron: string

  filePath: string

  parentId: number
}

export function queryPlan () {
  return http().get<ImportPlanRes[]>(`/import-plans/active`).then(data => {
    return data ? [data] : []
  })
}

export function addPlan (req: ImportPlanAddReq) {
  return http().post<any>(`/import-plans`, req)
}

export function deletePlan () {
  return http().delete<any>(`/import-plans/active`)
}

export function getImportFiles () {
  return http().get<string[]>(`/import-plans/files`)
}
