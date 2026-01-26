/**
 * @file Google Analytics
 * @author Surmon <https://github.com/surmon-china>
 */

import nodepress from '@/services/nodepress'

export const GOOGLE_ANALYTICS_API_PATHS = {
  BATCH_RUN_REPORTS: '/system/google-analytics/batch-run-reports',
  BATCH_RUN_PIVOT_REPORTS: '/system/google-analytics/batch-run-pivot-reports',
  RUN_REALTIME_REPORT: '/system/google-analytics/run-realtime-report'
}

export function googleAnalyticsBatchRunReports(params?: any) {
  return nodepress.post<any>(GOOGLE_ANALYTICS_API_PATHS.BATCH_RUN_REPORTS, params)
}

export function googleAnalyticsBatchRunPivotReports(params?: any) {
  return nodepress.post<any>(GOOGLE_ANALYTICS_API_PATHS.BATCH_RUN_PIVOT_REPORTS, params)
}

export function googleAnalyticsRunRealtimeReport(params?: any) {
  return nodepress.post<any>(GOOGLE_ANALYTICS_API_PATHS.RUN_REALTIME_REPORT, params)
}
