import React from 'react'
import { useNavigate } from 'react-router'
import { Dropdown, Avatar, Button, Modal, Select, Flex } from 'antd'
import * as Icons from '@ant-design/icons'
import { RoutesKey, RoutesPath } from '@/routes'
import { authLogout } from '@/apis/admin'
import { useTranslation } from '@/i18n'
import { useTheme } from '@/contexts/Theme'
import { useLocale, languages } from '@/contexts/Locale'
import { useAdminProfile } from '@/contexts/AdminProfile'
import { removeToken } from '@/services/token'

import styles from './style.module.less'

export interface AppHeaderProps {
  isSiderCollapsed: boolean
  onToggleSider(): void
}

export const AppHeader: React.FC<AppHeaderProps> = (props) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const locale = useLocale()
  const adminProfile = useAdminProfile()
  const { i18n } = useTranslation()

  const logout = () => {
    Modal.confirm({
      title: i18n.t('logout.confirmation'),
      centered: true,
      onOk() {
        authLogout()
          .then(() => {
            console.info('Logout successful')
            removeToken()
            navigate(RoutesPath[RoutesKey.Hello])
          })
          .catch((error) => {
            console.warn('Logout failed！', error)
          })
      }
    })
  }

  return (
    <Flex justify="space-between" className={styles.headerContent}>
      <Flex align="center" gap="middle">
        <Button
          type="text"
          className={styles.item}
          onClick={props.onToggleSider}
          icon={
            props.isSiderCollapsed ? <Icons.MenuUnfoldOutlined /> : <Icons.MenuFoldOutlined />
          }
        />
        <Button
          type="text"
          className={styles.item}
          onClick={() => theme.toggleTheme()}
          icon={theme.isDark ? <Icons.MoonOutlined /> : <Icons.SunOutlined />}
        />
        <Select
          size="small"
          className={styles.item}
          style={{ minWidth: 90 }}
          value={locale.language}
          onChange={locale.changeLanguage}
          options={languages.map((lang) => ({
            value: lang.code,
            label: lang.name
          }))}
        />
      </Flex>
      <Flex align="center" justify="center">
        <Dropdown
          placement="bottomRight"
          menu={{
            items: [
              {
                key: 'profile',
                icon: <Icons.SettingOutlined />,
                label: i18n.t('page.setting.title'),
                onClick: () => navigate(RoutesPath[RoutesKey.Setting])
              },
              {
                key: 'divider',
                type: 'divider'
              },
              {
                key: 'logout',
                icon: <Icons.LogoutOutlined />,
                label: i18n.t('logout.title'),
                danger: true,
                onClick: logout
              }
            ]
          }}
        >
          <div className={styles.userMenu}>
            <span>{adminProfile.data.name}</span>
            <Avatar
              shape="square"
              size="small"
              icon={<Icons.UserOutlined />}
              className={styles.avatar}
              src={adminProfile.data.avatar_url}
            />
          </div>
        </Dropdown>
      </Flex>
    </Flex>
  )
}
