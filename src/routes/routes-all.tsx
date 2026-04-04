import React from 'react'
import { Outlet } from 'react-router'

import { AppAuth } from '@/components/AppAuth'
import { AppLayout } from '@/components/AppLayout'
import { HelloPage } from '@/pages/Hello'
import { NotFoundPage } from '@/pages/NotFound'

import type { AppRouteObject } from './interface'
import { bizRoutes } from './routes-biz'
import { RoutesKey } from './keys'

export const allRoutes: AppRouteObject[] = [
  {
    id: RoutesKey.Hello,
    path: '/hello',
    element: <HelloPage />
  },
  {
    path: '/',
    children: bizRoutes,
    element: (
      <AppAuth>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </AppAuth>
    )
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]
