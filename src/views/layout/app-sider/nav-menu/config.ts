import { HOME } from '@/helpers/context'

export interface MenuOption {
    name: string
    icon?: string
    pid?: string,
    link?: string
    isAdmin?: boolean
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
  // {
  //   name: '全部文件',
  //   icon: 'appstore',
  //   pid: `${HOME}.file`,
  //   link: '/file'
  // },
  {
    name: '图纸管理',
    icon: 'client',
    pid: `${HOME}.file`,
    children: [
      {
        name: '图纸维护',
        icon: 'appstore',
        pid: `${HOME}.file`,
        link: '/file'
      },
      {
        name: '图纸检索',
        icon: 'search',
        pid: `${HOME}.search`,
        link: '/search'
      },
      {
        name: '回收站',
        icon: 'delete',
        pid: `${HOME}.recycle`,
        link: '/recycle'
      }
    ]
  },
  {
    name: '后台管理',
    icon: 'admin',
    pid: `${HOME}.dept`,
    isAdmin: true,
    children: [
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
      }
    ]
  }
  // {
  //   name: '我的分享',
  //   icon: 'share-alt',
  //   pid: `${HOME}.link`,
  //   link: '/link'
  // },
  // {
  //   name: '权限管理',
  //   icon: 'safety',
  //   pid: `${HOME}.authority`,
  //   link: '/authority'
  // },
  // {
  //   name: '我的收藏',
  //   icon: 'heart',
  //   pid: `${HOME}.favorite`,
  //   link: '/favorite'
  // },
  // {
  //   name: '自定义表单',
  //   icon: 'tool',
  //   pid: `${HOME}.library-config`,
  //   link: '/library-config'
  // },
  // {
  //   name: '自定义库',
  //   icon: 'book',
  //   pid: `${HOME}.library`,
  //   link: '/library'
  // },
  // {
  //   name: '系统配置',
  //   icon: 'setting',
  //   pid: `${HOME}.system`,
  //   children: [
  //     {
  //       name: '系统授权',
  //       pid: `${HOME}.system.auth`,
  //       link: '/system/auth'
  //     },
  //     {
  //       name: '导入计划',
  //       pid: `${HOME}.system.import-plan`,
  //       link: '/system/import-plan'
  //     },
  //     {
  //       name: '导出计划',
  //       pid: `${HOME}.system.export-plan`,
  //       link: '/system/export-plan'
  //     },
  //     {
  //       name: '参数配置',
  //       pid: `${HOME}.system.property`,
  //       link: '/system/property'
  //     }
  //   ]
  // },
  // {
  //   name: '水印设置',
  //   icon: 'barcode',
  //   pid: `${HOME}.watermark`,
  //   children: [
  //     {
  //       name: '水印列表',
  //       pid: `${HOME}.watermark.list`,
  //       link: '/watermark/list'
  //     },
  //     {
  //       name: '关联用户',
  //       pid: `${HOME}.watermark.user`,
  //       link: '/watermark/user'
  //     }
  //   ]
  // }
]
