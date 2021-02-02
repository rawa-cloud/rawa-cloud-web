import store from '@/store'

export default {
  libraryFieldType: {
    'text': '单文本',
    multi_text: '多文本',
    radio: '单选',
    checkbox: '多选',
    // bool: '布尔值',
    date: '日期',
    datetime: '日期时间'
    // date_range: '日期范围',
    // datetime_range: '日期时间范围'
  },
  status: {
    true: '有效',
    false: '无效'
  },
  logModule: {
    DEPT: '部门',
    USER: '用户',
    FILE: '文件',
    RECYCLE: '回收站',
    AUTHORITY: '权限',
    SHARE: '分享',
    LIB_CONFIG: '库模板',
    LIB: '自定义库',
    AUTH: '认证'
  },
  logType: {
    ADD: '新增',
    UPDATE: '更新',
    DELETE: '删除'
  },
  success: {
    true: '是',
    false: '否'
  },
  execStatus: {
    not_started: '未开始',
    ongoing: '执行中',
    completed: '已完成'
  },
  role: {
    'USER': '普通用户',
    'ADMIN': '文件夹管理员',
    'SUPER': '超级管理员'
  }
}

export function getDict (name: string, isAll = false): any[] {
  return (store.getters['dict/options'][name] || []).filter((v: any) => isAll ? true : v.status)
}

export function getDictItem (name: string, code: string, isAll = false): any {
  const dict = getDict(name, isAll)
  return dict.find((v: any) => v.code === code)
}

export function getDictLabel (name: string, code: string): any {
  const item = getDictItem(name, code, true)
  return (item && item.label) || code
}
