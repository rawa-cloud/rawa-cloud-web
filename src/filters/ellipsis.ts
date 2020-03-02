export default function size (text: string, max: number = 20, inverse: boolean = false) {
  let ret = text || ''
  if (ret.length <= max) return ret
  if (inverse) return '...' + ret.substr(-max)
  return ret.substr(-max) + '...'
}
