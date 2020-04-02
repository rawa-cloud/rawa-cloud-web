import { Route } from 'vue-router'

export const HOME: string = 'home'

export const adminUrls = [
  '/user',
  '/dept',
  '/authority',
  '/log',
  '/library-config'
]

export function isAdminUrl (route: Route) {
  const path = route.path
  return adminUrls.some(v => path.startsWith(v))
}
