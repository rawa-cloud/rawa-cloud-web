export function addDays (days: number, date: Date = new Date()) {
  let d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function formatDate (date: Date, format: string = 'yyyy/MM/dd HH:mm:ss') {
  let map: any = {
    yyyy: align(date.getFullYear(), 4),
    MM: align(date.getMonth() + 1),
    dd: align(date.getDate()),
    HH: align(date.getHours()),
    mm: align(date.getMinutes()),
    ss: align(date.getSeconds())
  }

  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let min = date.getMinutes()
  let sec = date.getSeconds()
  const regex = /(yyyy)|(MM)|(dd)|(HH)|(mm)|(ss)/g
  return format.replace(regex, (_, c) => {
    return map[_]
  })

  function align (text: string | number, num: number = 2) {
    return ('0' + text).substr(-num)
  }
}

export function normalizeDate (date: string) {
  if (!date) return undefined
  if (date.length <= 10) return date + ' 00:00:00'
  return date
}

export function parseDate (text: string, format = 'yyyy/MM/dd HH:mm:ss') {
  const year = +getText('yyyy')
  const month = +getText('MM')
  const day = +getText('dd')
  const hour = +getText('HH')
  const min = +getText('mm')
  const sec = +getText('ss')
  return new Date(year, month - 1, day, hour, min, sec)

  function getText (str: string) {
    const idx = format.indexOf(str)
    if (idx < 0) return ''
    return text.substr(idx, str.length)
  }
}
