import { iconMap } from '@/common/content-type'

export function getIcon (contentType: string) {
  let ret = Object.keys(iconMap).find(key => (contentType || '').toLowerCase().startsWith(key))
  return ret ? iconMap[ret] : 'file'
}
