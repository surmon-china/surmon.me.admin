/**
 * @file Dashboard page
 * @author Surmon <https://github.com/surmon-china>
 */

import React, { useEffect, useMemo, useState } from 'react'
import { onMounted } from 'veact'
import { Space, Row, Col, Button, Card, Divider, Radio } from 'antd'
import * as Icons from '@ant-design/icons'
import { useLoading } from '@/hooks/useLoading'
import { APP_LAYOUT_SPACE_SIZE, APP_LAYOUT_GUTTER_SIZE } from '@/config'
import { StatisticsCalendarItem, getArticlesCalendar, getCommentsCalendar } from '@/apis/system'
import { Statistics, getStatistics } from '@/apis/system'
import * as gaHelper from './GoogleAnalytics/common/helper'
import { GA_DATE_RANGE_OPTIONS } from './GoogleAnalytics/common/config'
import { GoogleAnalyticsRealtime } from './GoogleAnalytics/Realtime'
import { GoogleAnalyticsOverview } from './GoogleAnalytics/Overview'
import { GoogleAnalyticsRegions } from './GoogleAnalytics/Regions'
import { GoogleAnalyticsDevices } from './GoogleAnalytics/Devices'
import { GoogleAnalyticsPaths } from './GoogleAnalytics/Paths'
import { GoogleAnalyticsTitles } from './GoogleAnalytics/Titles'
import { getStatisticsCards } from './Statistics'
import { CalendarCard } from './Calendar'

import styles from './style.module.less'

export const DashboardPage: React.FC = () => {
  const calendarFetching = useLoading()
  const [articleCalendar, setArticleCalendar] = useState<StatisticsCalendarItem[]>([])
  const [commentCalendar, setCommentCalendar] = useState<StatisticsCalendarItem[]>([])
  const fetchCalendarData = async () => {
    const request = Promise.all([getArticlesCalendar(), getCommentsCalendar()])
    const [articleData, commentData] = await calendarFetching.promise(request)
    setArticleCalendar(articleData)
    setCommentCalendar(commentData)
  }

  const statisticsFetching = useLoading()
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const fetchStatistics = () => {
    statisticsFetching.promise(getStatistics()).then((result) => {
      setStatistics(result)
    })
  }

  const statisticsCardsElements = useMemo(() => {
    return getStatisticsCards(statistics!, statisticsFetching.state)
  }, [statistics, statisticsFetching.state])

  const analyticsFetching = useLoading()
  const [analyticsData, setAnalyticsData] = useState<any[]>([])
  const [analyticsDateRange, setAnalyticsDateRange] = useState<string>(
    GA_DATE_RANGE_OPTIONS[0].value
  )

  const fetchAnalyticsDataWithOption = () => {
    const option = GA_DATE_RANGE_OPTIONS.find((item) => item.value === analyticsDateRange)
    const { getStartDate, getEndDate, dimension } = option!.gaQueryParams
    const request = gaHelper.fetchAnalyticsReports(getStartDate(), getEndDate(), dimension)
    analyticsFetching.promise(request).then((response) => {
      setAnalyticsData(response.result?.data?.reports ?? [])
    })
  }

  useEffect(() => fetchAnalyticsDataWithOption(), [analyticsDateRange])

  onMounted(() => {
    fetchStatistics()
    fetchCalendarData()
  })

  return (
    <Space orientation="vertical" size={APP_LAYOUT_SPACE_SIZE} className={styles.dashboardPage}>
      <Row gutter={[APP_LAYOUT_GUTTER_SIZE, APP_LAYOUT_GUTTER_SIZE]}>
        {statisticsCardsElements.map((statisticsCard, index) => (
          <Col xs={24} md={12} lg={6} key={index}>
            {statisticsCard}
          </Col>
        ))}
      </Row>
      <Row gutter={[APP_LAYOUT_GUTTER_SIZE, APP_LAYOUT_GUTTER_SIZE]}>
        <Col xs={24}>
          <CalendarCard
            title="日历纵览"
            height={220}
            articleData={articleCalendar}
            commentData={commentCalendar}
            loading={calendarFetching.state}
            cardExtra={
              <Button
                size="small"
                loading={calendarFetching.state}
                icon={<Icons.ReloadOutlined />}
                onClick={() => fetchCalendarData()}
              />
            }
          />
        </Col>
      </Row>
      <Row gutter={[APP_LAYOUT_GUTTER_SIZE, APP_LAYOUT_GUTTER_SIZE]}>
        <Col xs={24} md={24} lg={9}>
          <Card
            variant="borderless"
            classNames={{ body: styles.gaChartContent }}
            title="GA Realtime（过去 30 分钟）"
          >
            <GoogleAnalyticsRealtime pollIntervalSeconds={16} chartHeight={200} />
          </Card>
        </Col>
        <Col xs={24} md={24} lg={15}>
          <Card
            variant="borderless"
            classNames={{ body: styles.gaChartContent }}
            loading={analyticsFetching.state}
            title="GA Overview"
            extra={
              <Space wrap>
                <Radio.Group
                  options={GA_DATE_RANGE_OPTIONS}
                  onChange={(e) => setAnalyticsDateRange(e.target.value)}
                  value={analyticsDateRange}
                  disabled={analyticsFetching.state}
                  optionType="button"
                  size="small"
                />
                <Divider orientation="vertical" />
                <Button
                  size="small"
                  loading={analyticsFetching.state}
                  icon={<Icons.ReloadOutlined />}
                  onClick={() => fetchAnalyticsDataWithOption()}
                />
              </Space>
            }
          >
            {!analyticsFetching.state && (
              <GoogleAnalyticsOverview
                chartHeight={200}
                activeDateRange={analyticsDateRange}
                rows={gaHelper.getUvPvRowsFromReports(analyticsData)}
              />
            )}
          </Card>
        </Col>
      </Row>
      <Row gutter={[APP_LAYOUT_GUTTER_SIZE, APP_LAYOUT_GUTTER_SIZE]}>
        <Col xs={24} md={12} lg={6}>
          <Card
            variant="borderless"
            title="GA Regions Rank"
            loading={analyticsFetching.state}
            classNames={{ body: styles.gaTreeListContent }}
          >
            {!analyticsFetching.state && (
              <GoogleAnalyticsRegions rows={gaHelper.getRegionRowsFromReports(analyticsData)} />
            )}
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card
            variant="borderless"
            title="GA Devices Rank"
            loading={analyticsFetching.state}
            classNames={{ body: styles.gaTreeListContent }}
          >
            {!analyticsFetching.state && (
              <GoogleAnalyticsDevices rows={gaHelper.getDeviceRowsFromReports(analyticsData)} />
            )}
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card
            variant="borderless"
            title="GA Urls Rank"
            loading={analyticsFetching.state}
            classNames={{ body: styles.gaTreeListContent }}
          >
            {!analyticsFetching.state && (
              <GoogleAnalyticsPaths rows={gaHelper.getPageRowsFromReports(analyticsData)} />
            )}
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card
            variant="borderless"
            title="GA Page Titles Rank"
            loading={analyticsFetching.state}
            classNames={{ body: styles.gaTreeListContent }}
          >
            {!analyticsFetching.state && (
              <GoogleAnalyticsTitles rows={gaHelper.getTitleRowsFromReports(analyticsData)} />
            )}
          </Card>
        </Col>
      </Row>
    </Space>
  )
}
