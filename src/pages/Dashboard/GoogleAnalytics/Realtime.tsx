import React, { useState, useRef, useMemo } from 'react'
import { onBeforeUnmount, onMounted } from 'veact'
import * as Icons from '@ant-design/icons'
import { Col, Row, List, Flex, Statistic, Divider, Empty } from 'antd'
import { APP_PRIMARY_COLOR } from '@/config'
import { APP_LAYOUT_GUTTER_SIZE } from '@/config'
import { countryCodeToEmoji } from '@/transforms/country'
import { ECharts } from '@/components/common/Echarts'
import { getBarChartConfig } from '@/components/common/Echarts/config.bar'
import { UniversalText } from '@/components/common/UniversalText'
import { googleAnalyticsRunRealtimeReport } from '@/apis/google-analytics'
import { ReportRowItem } from './common/helper'

// https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runRealtimeReport
export const fetchAnalyticsRealtimeReports = (dimensions: string[]) => {
  return googleAnalyticsRunRealtimeReport({
    dimensions: dimensions.map((name) => ({ name })),
    metrics: ['activeUsers'].map((name) => ({ name }))
  })
}

export interface GoogleAnalyticsRealtimeProps extends React.PropsWithChildren {
  pollIntervalSeconds: number
  chartHeight: number
}

export const GoogleAnalyticsRealtime: React.FC<GoogleAnalyticsRealtimeProps> = (props) => {
  const intervalId = useRef<number>(undefined)
  const isCanceled = useRef(false)

  const [timelineReports, setTimelineReports] = useState<ReportRowItem[]>([])
  const [regionReports, setRegionReports] = useState<ReportRowItem[]>([])
  // for chart
  const timelineDataSet = useMemo(() => {
    const timeList: string[] = []
    const valueList: number[] = []
    Array.from({ length: 30 }, (_, i) => {
      const key = String(Math.abs(i - 30)).padStart(2, '0')
      const found = timelineReports.find((r) => r.dimensionValues[0].value === key)
      const value = found?.metricValues[0].value
      timeList.push(key)
      valueList.push(value ? Number(value) : 0)
    })
    return { timeList, valueList }
  }, [timelineReports])

  const totalActiveUsers = useMemo(
    () => timelineDataSet.valueList.reduce((prev, value) => prev + value, 0),
    [timelineDataSet]
  )

  const timelineChartConfig = useMemo(() => {
    return getBarChartConfig({
      xLabelFormatter: (value) => `-${Number(value)}分钟`,
      tooltipLabelFormatter: ({ value }) => `${Number(value)} 分钟前`,
      categoryData: timelineDataSet.timeList,
      barsData: [
        {
          data: timelineDataSet.valueList,
          name: 'Active Users',
          color: APP_PRIMARY_COLOR
        }
      ]
    })
  }, [timelineDataSet])

  const fetchRealtimeReports = () => {
    window.clearTimeout(intervalId.current)
    const timeRequest = fetchAnalyticsRealtimeReports(['minutesAgo']).then((response) => {
      setTimelineReports(response.result.data.rows ?? [])
    })
    const regionRequest = fetchAnalyticsRealtimeReports(['countryId', 'city']).then(
      (response) => {
        setRegionReports(response.result.data.rows ?? [])
      }
    )
    Promise.all([timeRequest, regionRequest]).then(() => {
      if (!isCanceled.current) {
        intervalId.current = window.setTimeout(
          fetchRealtimeReports,
          props.pollIntervalSeconds * 1000
        )
      }
    })
  }

  onMounted(() => {
    fetchRealtimeReports()
  })

  onBeforeUnmount(() => {
    isCanceled.current = true
    window.clearTimeout(intervalId.current)
  })

  const renderRegionList = (dataSource: ReportRowItem[]) => (
    <List
      style={{
        maxHeight: 120,
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        overscrollBehavior: 'contain'
      }}
      size="small"
      itemLayout="vertical"
      dataSource={dataSource}
      renderItem={(item, index) => (
        <List.Item key={index} style={{ paddingInline: 0 }}>
          <Flex justify="space-between">
            {item.dimensionValues[0].value.includes('other') ? (
              <UniversalText
                text={'__'}
                prefix="🌍"
                suffix={
                  <UniversalText text={item.dimensionValues[1].value} type="secondary" small />
                }
              />
            ) : (
              <UniversalText
                text={item.dimensionValues[0].value}
                prefix={countryCodeToEmoji(item.dimensionValues[0].value)}
                suffix={
                  <UniversalText text={item.dimensionValues[1].value} type="secondary" small />
                }
              />
            )}
            <UniversalText text={item.metricValues[0].value} type="secondary" />
          </Flex>
        </List.Item>
      )}
    />
  )

  return (
    <Row gutter={[APP_LAYOUT_GUTTER_SIZE, APP_LAYOUT_GUTTER_SIZE]}>
      <Col xs={16}>
        <ECharts
          options={timelineChartConfig}
          style={{ width: '100%', height: props.chartHeight }}
        />
      </Col>
      <Col xs={8}>
        <Statistic
          prefix={<Icons.UserOutlined />}
          title="Active Users"
          value={totalActiveUsers}
        />
        <Divider style={{ marginBottom: 0, marginTop: 14 }} />
        {regionReports.length ? (
          renderRegionList(regionReports)
        ) : (
          <Empty image={null} styles={{ image: { height: '1rem' } }} />
        )}
      </Col>
    </Row>
  )
}
