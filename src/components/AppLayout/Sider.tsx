import classnames from 'classnames'
import React, { useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { Menu, Spin, Typography, MenuProps, Space, Flex } from 'antd'
import * as Icons from '@ant-design/icons'
import { GITHUB_REPO_URL } from '@/config'
import { Trans } from '@/i18n'
import { RouteObject, RoutesKey, RoutesPath } from '@/routes'
import { pageRoutes } from '@/routes/pages'
import { useLocale } from '@/contexts/Locale'
import { useAdminProfile } from '@/contexts/AdminProfile'
import { getResourceUrl } from '@/transforms/url'

import styles from './style.module.less'

const transRoutesToMenuItems = (routes: RouteObject[]): NonNullable<MenuProps['items']> => {
  return routes
    .filter((route) => !route.handle?.hiddenInMenu)
    .map((route) => ({
      key: route.path!,
      icon: route.handle?.icon,
      children: route?.children ? transRoutesToMenuItems(route.children) : null,
      label: route.handle?.i18nKey ? <Trans i18nKey={route.handle.i18nKey} /> : route.handle?.name
    }))
}

export interface AppSiderProps {
  isSiderCollapsed: boolean
}

export const AppSider: React.FC<AppSiderProps> = ({ isSiderCollapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { language } = useLocale()
  const adminProfile = useAdminProfile()
  const mainMenuItems = useMemo(() => transRoutesToMenuItems(pageRoutes), [language])

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
        defaultOpenKeys={[RoutesPath[RoutesKey.Article]]}
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
