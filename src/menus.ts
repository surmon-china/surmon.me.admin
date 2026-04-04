import { RoutesKey } from './routes/keys'

export interface MenuLeafItem {
  routeId: RoutesKey
}

export interface MenuRouteGroupItem {
  routeId: RoutesKey
  children: MenuLeafItem[]
}

export interface MenuGroupItem {
  groupKey: string
  i18nKey: string
  children: Array<MenuLeafItem | MenuRouteGroupItem>
}

export type MenuItem = MenuLeafItem | MenuRouteGroupItem | MenuGroupItem

export const isMenuGroupItem = (item: MenuItem): item is MenuGroupItem => {
  return 'groupKey' in item
}

export const isMenuRouteGroupItem = (item: MenuItem): item is MenuRouteGroupItem => {
  return 'routeId' in item && 'children' in item
}

export const menuItems: MenuItem[] = [
  { routeId: RoutesKey.Dashboard },
  {
    groupKey: 'content',
    i18nKey: 'menu.group.content',
    children: [
      { routeId: RoutesKey.Announcement },
      { routeId: RoutesKey.Category },
      { routeId: RoutesKey.Tag },
      {
        routeId: RoutesKey.Article,
        children: [{ routeId: RoutesKey.ArticleList }, { routeId: RoutesKey.ArticlePost }]
      }
    ]
  },
  {
    groupKey: 'interaction',
    i18nKey: 'menu.group.interaction',
    children: [
      { routeId: RoutesKey.Comment },
      { routeId: RoutesKey.Vote },
      { routeId: RoutesKey.Feedback },
      { routeId: RoutesKey.AiAgent }
    ]
  },
  {
    groupKey: 'system',
    i18nKey: 'menu.group.system',
    children: [
      { routeId: RoutesKey.User },
      { routeId: RoutesKey.Static },
      { routeId: RoutesKey.Setting }
    ]
  }
]
