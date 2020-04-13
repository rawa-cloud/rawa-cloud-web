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
    link: '/file'
  },
  {
    name: '我的分享',
    icon: 'share-alt',
    pid: `${HOME}.link`,
    link: '/link'
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
    name: '权限管理',
    icon: 'safety',
    pid: `${HOME}.authority`,
    link: '/authority'
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
    name: '我的收藏',
    icon: 'heart-o',
    pid: `${HOME}.favorite`,
    link: '/favorite'
  },
  {
    name: '回收站',
    icon: 'delete',
    pid: `${HOME}.recycle`,
    link: '/recycle'
  },
  {
    name: '自定义表单',
    icon: 'tool',
    pid: `${HOME}.library-config`,
    link: '/library-config'
  },
  // {
  //   name: '自定义库',
  //   icon: 'book',
  //   pid: `${HOME}.library`,
  //   link: '/library'
  // },
  {
    name: '系统配置',
    icon: 'setting',
    pid: `${HOME}.system`,
    children: [
      {
        name: '系统授权',
        pid: `${HOME}.system.auth`,
        link: '/system/auth'
      }
    ]
  }
]
