import classnames from 'classnames'
import React, { useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { Menu, Spin, Typography, MenuProps, Space, Flex } from 'antd'
import * as Icons from '@ant-design/icons'
import { GITHUB_REPO_URL } from '@/config'
import { Trans } from '@/i18n'
import { routeMap, RoutesKey, getRoutePath } from '@/routes'
import { type MenuItem, menuItems, isMenuGroupItem, isMenuRouteGroupItem } from '@/menus'
import { useAdminProfile } from '@/contexts/AdminProfile'
import { useLocale } from '@/contexts/Locale'
import { getResourceUrl } from '@/transforms/url'

import styles from './style.module.less'

const transMenuItems = (items: MenuItem[]): NonNullable<MenuProps['items']> => {
  return items.map((item) => {
    if (isMenuGroupItem(item)) {
      return {
        type: 'group',
        key: item.groupKey,
        label: <Trans i18nKey={item.i18nKey} />,
        children: transMenuItems(item.children)
      }
    }

    const handle = routeMap.get(item.routeId)?.handle
    const path = routeMap.get(item.routeId)?.path ?? item.routeId

    if (isMenuRouteGroupItem(item)) {
      return {
        key: path,
        icon: handle?.icon,
        label: handle?.i18nKey ? <Trans i18nKey={handle.i18nKey} /> : handle?.name,
        children: transMenuItems(item.children)
      }
    }

    return {
      key: path,
      icon: handle?.icon,
      label: handle?.i18nKey ? <Trans i18nKey={handle.i18nKey} /> : handle?.name
    }
  })
}

export interface AppSiderProps {
  isSiderCollapsed: boolean
}

export const AppSider: React.FC<AppSiderProps> = ({ isSiderCollapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { language } = useLocale()
  const adminProfile = useAdminProfile()
  const mainMenuItems = useMemo(() => transMenuItems(menuItems), [language])

  return (
    <div className={styles.siderContent}>
      <Link to="/" className={styles.logo}>
        <img
          alt="logo"
          style={{ width: isSiderCollapsed ? '40%' : '60%' }}
          src={getResourceUrl(isSiderCollapsed ? `/images/logo.mini.svg` : `/images/logo.svg`)}
        />
      </Link>
      <Spin spinning={adminProfile.loading} size="small">
        <Flex
          vertical
          justify="center"
          align="center"
          className={classnames(styles.userInfo, isSiderCollapsed && styles.collapsed)}
        >
          <img
            draggable={false}
            className={styles.avatar}
            src={adminProfile.data.avatar_url}
            alt={adminProfile.data.name}
          />
          <Typography.Title level={5} className={styles.name} title={adminProfile.data.name}>
            {adminProfile.data.name || '-'}
          </Typography.Title>
          <Typography.Text
            type="secondary"
            ellipsis={true}
            className={styles.slogan}
            title={adminProfile.data.slogan}
          >
            {isSiderCollapsed ? '...' : adminProfile.data.slogan || '-'}
          </Typography.Text>
        </Flex>
      </Spin>
      <Menu
        mode="inline"
        className={styles.menus}
        onClick={(event) => navigate(event.key)}
        selectedKeys={[location.pathname]}
        defaultOpenKeys={[getRoutePath(RoutesKey.Article)]}
        items={mainMenuItems}
      />
      <a
        type="link"
        target="_blank"
        rel="noreferrer"
        href={GITHUB_REPO_URL}
        className={classnames(styles.footerLink, isSiderCollapsed && styles.collapsed)}
      >
        {isSiderCollapsed ? (
          <Icons.GithubOutlined />
        ) : (
          <Space size="small">
            <Icons.GithubOutlined />
            source-code
          </Space>
        )}
      </a>
    </div>
  )
}
