import { RouteObject as ReactRouteObject } from 'react-router'

export interface RouteHandle {
  name?: string
  i18nKey?: string
  icon?: React.ReactElement
  hiddenInMenu?: boolean
}

export interface RouteObject extends Omit<ReactRouteObject, 'children'> {
  handle?: RouteHandle
  children?: RouteObject[]
}
