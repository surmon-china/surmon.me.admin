import React from 'react'
import { onMounted } from 'veact'
import { useLocation, matchPath } from 'react-router'
import { Card, Breadcrumb, FloatButton, Typography, Flex } from 'antd'
import { CaretUpOutlined } from '@ant-design/icons'
import { ENABLED_HEADER_AD } from '@/config'
import { useTranslation } from '@/i18n'
import { routeMap } from '@/routes'

import styles from './style.module.less'

const HeaderAdvert: React.FC = () => {
  onMounted(() => {
    const win: any = window
    ;(win.adsbygoogle = win.adsbygoogle || []).push({})
  })

  return (
    <div className={styles.pageHeaderAdvert}>
      <Card classNames={{ body: styles.adCard }} size="small" variant="borderless">
        <ins
          className="adsbygoogle"
          style={{ display: 'inline-block', width: 728, height: 90 }}
          data-ad-client="ca-pub-4710915636313788"
          data-ad-slot="5883149084"
        ></ins>
      </Card>
    </div>
  )
}

export const AppContent: React.FC<React.PropsWithChildren> = (props) => {
  const { i18n } = useTranslation()
  const { pathname } = useLocation()
  const [, ...paths] = pathname.split('/')
  const currentRoute = routeMap.values().find((route) => {
    return route.path && matchPath(route.path, pathname)
  })

  return (
    <div className={styles.pageContainer}>
      <Flex align="center" justify="space-between" className={styles.pageHeader}>
        <Typography.Title className={styles.title} level={4}>
          <span className={styles.icon}>{currentRoute?.handle?.icon}</span>
          {currentRoute?.handle?.i18nKey
            ? i18n.t(currentRoute.handle.i18nKey)
            : currentRoute?.handle?.name}
        </Typography.Title>
        <Breadcrumb
          className={styles.breadcrumb}
          items={paths.map((path) => ({ title: path }))}
        />
      </Flex>
      {ENABLED_HEADER_AD && <HeaderAdvert />}
      <div className={styles.pageContent}>{props?.children}</div>
      <FloatButton.BackTop
        className={styles.backTop}
        shape="square"
        type="primary"
        icon={<CaretUpOutlined />}
      />
    </div>
  )
}
