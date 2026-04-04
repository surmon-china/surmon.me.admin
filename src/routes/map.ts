import type { AppRouteObject } from './interface'
import { RoutesKey } from './keys'

export const buildRouteMap = (list: AppRouteObject[]): Map<RoutesKey, AppRouteObject> => {
  const map = new Map<RoutesKey, AppRouteObject>()
  const walk = (routes: AppRouteObject[]) => {
    for (const route of routes) {
      if (route.id) map.set(route.id as RoutesKey, route)
      if (route.children?.length) walk(route.children)
    }
  }

  walk(list)
  return map
}
