import React from 'react'
import { Link } from 'react-router'
import { Flex, Divider, Rate, Typography } from 'antd'
import * as Icons from '@ant-design/icons'
import { Statistics } from '@/apis/system'
import { RoutesKey, RoutesPath } from '@/routes'
import { numberToKilo } from '@/transforms/number'
import { StatisticCard } from './Card'

import styles from './style.module.less'

export const getStatisticsCards = (statistics: Statistics | null, loading: boolean) => {
  return [
    <StatisticCard
      key="views"
      loading={loading}
      title="今日阅读（文章页 PV）"
      value={statistics?.todayViews ?? '-'}
      suffix="次"
      icon={<Icons.EyeOutlined />}
      extra={
        <Flex justify="space-between">
          <Typography.Text type="secondary">
            累计阅读 <strong>{numberToKilo(statistics?.totalViews ?? 0)}</strong>
          </Typography.Text>
          <Link className={styles.link} to={RoutesPath[RoutesKey.ArticlePost]}>
            <Icons.EditOutlined /> 写文章
          </Link>
        </Flex>
      }
    />,
    <StatisticCard
      key="comments"
      loading={loading}
      title="全站评论"
      value={statistics?.comments ?? '-'}
      suffix="条"
      icon={<Icons.CommentOutlined />}
      extra={
        <Flex justify="space-between" align="center">
          <Link className={styles.link} to={RoutesPath[RoutesKey.Comment]}>
            管理评论
          </Link>
          <Divider orientation="vertical" />
          <Link
            className={styles.link}
            to={RoutesPath[RoutesKey.Comment] + '?target_type=page&target_id=0'}
          >
            查看留言
          </Link>
        </Flex>
      }
    />,
    <StatisticCard
      key="likes"
      loading={loading}
      title="累计获得喜欢"
      value={statistics?.totalLikes ?? '-'}
      suffix="次"
      icon={<Icons.HeartOutlined />}
      extra={
        <Flex justify="space-between">
          <Rate count={5} disabled allowHalf value={statistics?.averageEmotion} />
          <Link className={styles.link} to={RoutesPath[RoutesKey.Feedback]}>
            站点反馈
          </Link>
        </Flex>
      }
    />,
    <StatisticCard
      key="contents"
      loading={loading}
      title="共发布文章"
      value={statistics?.articles ?? '-'}
      suffix="篇"
      icon={<Icons.CoffeeOutlined />}
      extra={
        <Flex justify="space-between">
          <Typography.Text type="secondary">
            <strong>{statistics?.tags ?? '-'}</strong> 个文章标签
          </Typography.Text>
          <Link className={styles.link} to={RoutesPath[RoutesKey.Tag]}>
            管理标签
          </Link>
        </Flex>
      }
    />
  ]
}
