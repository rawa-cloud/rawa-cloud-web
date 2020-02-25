import dict from '@/common/dict'

let map: any = dict

export default function (value: any, key: string, defaultValue?: any) {
  let ret = map[key] && map[key][value]
  if (ret === undefined) return defaultValue === undefined ? value : defaultValue
  return ret
}
