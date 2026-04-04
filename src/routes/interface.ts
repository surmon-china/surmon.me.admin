import type { RouteObject } from 'react-router'

export interface RouteHandle {
  name?: string
  i18nKey?: string
  icon?: React.ReactElement
}

export type AppRouteObject = Omit<RouteObject, 'handle' | 'children'> & {
  handle?: RouteHandle
  children?: AppRouteObject[]
}
