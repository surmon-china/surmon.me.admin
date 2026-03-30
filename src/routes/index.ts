/**
 * @file App routes
 * @author Surmon <https://github.com/surmon-china>
 */

import { allRoutes } from './routes-all'
import { RoutesKey } from './keys'
import { buildRouteMap } from './map'

export type * from './interface'
export { RoutesKey } from './keys'
export { allRoutes } from './routes-all'
export { bizRoutes } from './routes-biz'

export const routeMap = buildRouteMap(allRoutes)

export const getRoutePath = (key: RoutesKey): string => routeMap.get(key)?.path ?? ''
export const getArticleDetailRoutePath = (articleId: number) => `/article/edit/${articleId}`
