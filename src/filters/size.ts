export default function size (value: number, precise: number = 2, mode?: 'K' | 'M' | 'G') {
  value = +value
  let units = ['K', 'M', 'G']
  if (!units.includes(mode as any)) {
    if (value / Math.pow(1024, 3) >= 1) mode = 'G'
    else if (value / Math.pow(1024, 2) < 1) mode = 'K'
    else mode = 'M'
  }
  let i = units.findIndex(v => mode === v)
  let ratio = Math.pow(1024, i + 1)
  return (value / ratio).toFixed(precise) + mode
}
