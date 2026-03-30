/**
 * @file App router
 * @author Surmon <https://github.com/surmon-china>
 */

import type { RouteObject } from 'react-router'
import { createHashRouter, createBrowserRouter } from 'react-router'
import { allRoutes } from './routes'
import { ENABLED_HASH_ROUTER } from '@/config'

// MARK: WORKAROUND for demo site
export const router = ENABLED_HASH_ROUTER
  ? createHashRouter(allRoutes as RouteObject[])
  : createBrowserRouter(allRoutes as RouteObject[])
