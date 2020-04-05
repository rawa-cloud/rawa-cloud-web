export function copy (copyTxt: string) {
  document.addEventListener('copy', handler) // 增加copy监听
  document.execCommand('copy') // 执行copy命令触发监听
  document.removeEventListener('copy', handler)
  function handler (event: any) {
    event.clipboardData.setData('text/plain', copyTxt)
    event.preventDefault()
    document.removeEventListener('copy', handler)
  }
}
