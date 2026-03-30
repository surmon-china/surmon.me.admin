import type { RouteObject } from './interface'
import { RoutesKey } from './keys'

export const buildRouteMap = (list: RouteObject[]): Map<RoutesKey, RouteObject> => {
  const map = new Map<RoutesKey, RouteObject>()
  const walk = (routes: RouteObject[]) => {
    for (const route of routes) {
      if (route.id) map.set(route.id as RoutesKey, route)
      if (route.children?.length) walk(route.children)
    }
  }

  walk(list)
  return map
}
