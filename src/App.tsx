/**
 * @file App component
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { onMounted } from 'veact'
import type { RouteObject } from 'react-router'
import { RouterProvider, createHashRouter, createBrowserRouter } from 'react-router'
import { VITE_ENV, APP_PRIMARY_COLOR, ENABLED_HASH_ROUTER } from '@/config'
import { App as AntdAppContainer } from 'antd'
import { AntdConfigProvider } from '@/contexts/AntdConfig'
import { AdminProfileProvider } from '@/contexts/AdminProfile'
import { AxiosTopLoadingBar } from '@/components/common/AxiosTopLoadingBar'
import { nodepress } from '@/services/nodepress'
import { routes } from './routes'

// MARK: WORKAROUND for demo site
export const router = ENABLED_HASH_ROUTER
  ? createHashRouter(routes as RouteObject[])
  : createBrowserRouter(routes as RouteObject[])

export const App: React.FC = () => {
  onMounted(() => {
    console.group('🟢 App is running.')
    console.table({ VITE_ENV })
    console.groupEnd()
  })

  return (
    <AntdConfigProvider>
      <AntdAppContainer className="app-container">
        <div id="app" className="app">
          <AxiosTopLoadingBar
            axios={nodepress}
            color={APP_PRIMARY_COLOR}
            height={3}
            transitionTime={380}
            loaderSpeed={600}
            waitingTime={800}
          />
          <AdminProfileProvider>
            <RouterProvider router={router} />
          </AdminProfileProvider>
        </div>
      </AntdAppContainer>
    </AntdConfigProvider>
  )
}
