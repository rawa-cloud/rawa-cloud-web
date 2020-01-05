import { HOME } from '@/helpers/context'

export interface MenuOption {
    name: string
    icon?: string
    pid?: string,
    link?: string
    children?: Array<MenuOption>
}

export const menus: Array<MenuOption> = [
  // 暂时不需要
  // {
  //   name: 'Dashboard',
  //   icon: 'rocket',
  //   pid: `${HOME}.dashboard`,
  //   link: '/dashboard'
  // },
  {
    name: '全部文件',
    icon: 'folder-open',
    pid: `${HOME}.file`,
    link: '/file?id=-2'
  },
  {
    name: '我的分享',
    icon: 'share-alt',
    pid: `${HOME}.link`,
    link: '/link'
  },
  {
    name: '回收站',
    icon: 'delete',
    pid: `${HOME}.recycle`,
    link: '/recycle'
  },
  {
    name: '部门管理',
    icon: 'layout',
    pid: `${HOME}.dept`,
    link: '/dept'
  },
  {
    name: '用户管理',
    icon: 'user',
    pid: `${HOME}.user`,
    link: '/user'
  },
  {
    name: '操作日志',
    icon: 'solution',
    pid: `${HOME}.log`,
    link: '/log'
  },
  {
    name: '文件搜索',
    icon: 'search',
    pid: `${HOME}.search`,
    link: '/search'
  },
  {
    name: '系统管理',
    icon: 'setting',
    pid: `${HOME}.system`,
    children: [
      {
        name: '用户管理',
        pid: `${HOME}.system.user`,
        link: '/system/user'
      }
    ]
  }
]
