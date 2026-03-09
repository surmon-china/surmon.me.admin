import React from 'react'
import { Navigate } from 'react-router'
import * as Icons from '@ant-design/icons'

import { DashboardPage } from '@/pages/Dashboard'
import { ArticleListPage } from '@/pages/Article/List'
import { ArticleEditPage } from '@/pages/Article/Edit'
import { ArticleCreatePage } from '@/pages/Article/Create'
import { AnnouncementPage } from '@/pages/Announcement'
import { CategoryPage } from '@/pages/Category'
import { TagPage } from '@/pages/Tag'
import { VotePage } from '@/pages/Vote'
import { CommentPage } from '@/pages/Comment'
import { FeedbackPage } from '@/pages/Feedback'
import { SettingPage } from '@/pages/Setting'
import { StaticPage } from '@/pages/Static'
import { UserPage } from '@/pages/User'
import { AiAgentPage } from '@/pages/AiAgent'

import { RouteObject } from '.'
import { RoutesKey } from './keys'

export const pageRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/dashboard" />,
    handle: {
      hiddenInMenu: true
    }
  },
  {
    id: RoutesKey.Dashboard,
    path: '/dashboard',
    element: <DashboardPage />,
    handle: {
      i18nKey: 'page.dashboard.title',
      icon: <Icons.DashboardOutlined />
    }
  },
  {
    id: RoutesKey.Announcement,
    path: '/announcement',
    element: <AnnouncementPage />,
    handle: {
      i18nKey: 'page.announcement.title',
      icon: <Icons.SoundOutlined />
    }
  },
  {
    id: RoutesKey.Category,
    path: '/category',
    element: <CategoryPage />,
    handle: {
      i18nKey: 'page.category.title',
      icon: <Icons.AppstoreOutlined />
    }
  },
  {
    id: RoutesKey.Tag,
    path: '/tag',
    element: <TagPage />,
    handle: {
      i18nKey: 'page.tag.title',
      icon: <Icons.TagsOutlined />
    }
  },
  {
    id: RoutesKey.Article,
    path: '/article',
    handle: {
      i18nKey: 'page.article.title',
      icon: <Icons.CoffeeOutlined />
    },
    children: [
      {
        index: true,
        element: <Navigate to="/article/list" />,
        handle: {
          hiddenInMenu: true
        }
      },
      {
        id: RoutesKey.ArticleList,
        path: '/article/list',
        element: <ArticleListPage />,
        handle: {
          i18nKey: 'page.article.list',
          icon: <Icons.OrderedListOutlined />
        }
      },
      {
        id: RoutesKey.ArticlePost,
        path: '/article/post',
        element: <ArticleCreatePage />,
        handle: {
          i18nKey: 'page.article.create',
          icon: <Icons.EditOutlined />
        }
      },
      {
        id: RoutesKey.ArticleEdit,
        path: '/article/edit/:article_id',
        element: <ArticleEditPage />,
        handle: {
          i18nKey: 'page.article.edit',
          icon: <Icons.EditOutlined />,
          hiddenInMenu: true
        }
      }
    ]
  },
  {
    id: RoutesKey.Comment,
    path: '/comment',
    element: <CommentPage />,
    handle: {
      i18nKey: 'page.comment.title',
      icon: <Icons.CommentOutlined />
    }
  },
  {
    id: RoutesKey.Vote,
    path: '/vote',
    element: <VotePage />,
    handle: {
      i18nKey: 'page.vote.title',
      icon: <Icons.LikeOutlined />
    }
  },
  {
    id: RoutesKey.Feedback,
    path: '/feedback',
    element: <FeedbackPage />,
    handle: {
      i18nKey: 'page.feedback.title',
      icon: <Icons.SmileOutlined />
    }
  },
  {
    id: RoutesKey.User,
    path: '/user',
    element: <UserPage />,
    handle: {
      i18nKey: 'page.user.title',
      icon: <Icons.UserOutlined />
    }
  },
  {
    id: RoutesKey.Static,
    path: '/static',
    element: <StaticPage />,
    handle: {
      i18nKey: 'page.setting.statics',
      icon: <Icons.FileSearchOutlined />
    }
  },
  {
    id: RoutesKey.Setting,
    path: '/setting',
    element: <SettingPage />,
    handle: {
      i18nKey: 'page.setting.title',
      icon: <Icons.SettingOutlined />
    }
  },
  {
    id: RoutesKey.AiAgent,
    path: '/ai-agent',
    element: <AiAgentPage />,
    handle: {
      i18nKey: 'page.ai-agent.title',
      icon: <Icons.RobotOutlined />
    }
  }
]
