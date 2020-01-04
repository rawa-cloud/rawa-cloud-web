import { UMASK, allUmask, hasAnyAuthority } from '@/common/umask'

export default function (value: number) {
  value = +value
  if (allUmask(value)) return '完全控制'
  let ret: string[] = []
  Object.values(UMASK).forEach((v: any) => {
    if (hasAnyAuthority(value, v.value)) ret.push(v.desc)
  })
  return ret.join(',')
}
