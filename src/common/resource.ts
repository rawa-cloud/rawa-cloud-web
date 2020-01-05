import { HOME } from '../helpers/context'

const user = [
  {
    pid: `${HOME}`,
    children: [
      {
        pid: `file`
      },
      {
        pid: `link`
      },
      {
        pid: `recycle`
      },
      {
        pid: 'search'
      }
    ]
  }
]

const admin = [
  {
    pid: `${HOME}`,
    children: [
      {
        pid: `dashboard`
      },
      {
        pid: `file`
      },
      {
        pid: `link`
      },
      {
        pid: `recycle`
      },
      {
        pid: 'search'
      }
    ]
  }
]

const root = [
  {
    pid: `${HOME}`,
    children: [
      {
        pid: `dashboard`
      },
      {
        pid: `file`
      },
      {
        pid: `link`
      },
      {
        pid: `recycle`
      },
      {
        pid: 'dept'
      },
      {
        pid: 'user'
      },
      {
        pid: 'log'
      },
      {
        pid: 'search'
      }
    ]
  }
]

function toArray (tree: any, parentKey: string = '') {
  let ret: any[] = []
  tree.forEach((v: any) => {
    let pid = (parentKey && (parentKey + '.')) + v.pid
    ret.push({ pid })
    if (Array.isArray(v.children)) ret.push(...toArray(v.children, pid))
  })
  return ret
}

const map: any = {
  'SUPER': toArray(root),
  'ADMIN': toArray(admin),
  'USER': toArray(user)
}

export function getAuthorities (roles: string[] = []) {
  let ret: any[] = []
  roles.forEach((v: any) => {
    ret.push(...(map[v] || []))
  })
  return ret
}
