import { APP_PRIMARY_COLOR } from '@/config'
import type { ChartOptions } from '.'

export interface ChartOptionsConfig {
  categoryData: string[]
  barsData: Array<{
    data: number[]
    name?: string
    color?: string
  }>

  dataZoom?: boolean
  startValue?: string
  endValue?: string
  xLabelFormatter?(value: string, index: number): string
  tooltipLabelFormatter?(params: any): string
}

export const getBarChartConfig = (config: ChartOptionsConfig): ChartOptions => ({
  grid: {
    show: true,
    top: '4',
    left: '0',
    right: '0',
    bottom: config.dataZoom ? '58' : '2',
    borderWidth: 0,
    containLabel: true
  },
  series: config.barsData.map((item) => ({
    type: 'bar',
    name: item.name,
    data: item.data,
    itemStyle: {
      color: item.color,
      borderRadius: [2, 2, 0, 0]
    }
  })),
  xAxis: [
    {
      type: 'category',
      data: config.categoryData,
      axisTick: {
        lineStyle: {
          color: 'var(--app-color-text-quaternary)'
        }
      },
      axisLine: {
        lineStyle: {
          color: 'var(--app-color-text-quaternary)'
        }
      },
      axisLabel: {
        formatter: config.xLabelFormatter,
        fontFamily: 'inherit',
        color: 'var(--app-color-text-secondary)'
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      minInterval: 1,
      axisLabel: {
        fontFamily: 'inherit',
        color: 'var(--app-color-text-secondary)',
        formatter(value) {
          return value ? String(value) : ''
        }
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'var(--app-color-border-secondary)'
        }
      }
    }
  ],
  tooltip: {
    trigger: 'axis',
    confine: true,
    borderWidth: 0,
    backgroundColor: 'var(--app-color-bg-spotlight)',
    textStyle: {
      fontWeight: 'bolder',
      fontFamily: 'inherit',
      color: 'var(--app-color-text-light-solid)'
    },
    // @ts-ignore
    shadowStyle: {
      color: 'var(--app-color-fill-secondary)'
    },
    axisPointer: {
      type: 'shadow',
      label: {
        show: true,
        margin: 24,
        // padding: [4, 12, 4, 4],
        fontFamily: 'inherit',
        fontWeight: 'bolder',
        color: '#fff',
        backgroundColor: APP_PRIMARY_COLOR,
        formatter: config.tooltipLabelFormatter
      }
    }
  },
  dataZoom: !config.dataZoom
    ? []
    : [
        {
          type: 'inside',
          startValue: config.startValue,
          endValue: config.endValue
        },
        {
          show: true,
          brushSelect: false,
          startValue: config.startValue,
          endValue: config.endValue,
          borderColor: 'var(--app-color-border-secondary)',
          fillerColor: 'var(--app-color-split)',
          dataBackground: {
            lineStyle: {
              color: 'var(--app-color-primary-border)'
            }
          },
          selectedDataBackground: {
            areaStyle: {
              color: 'var(--app-color-primary)'
            },
            lineStyle: {
              color: 'var(--app-color-primary)'
            }
          },
          handleStyle: {
            color: 'var(--app-color-bg-base)',
            borderColor: 'var(--app-color-text-quaternary)'
          },
          left: 2,
          right: 6,
          bottom: 0,
          height: 28,
          textStyle: {
            fontWeight: 'bolder',
            fontFamily: 'inherit',
            color: 'var(--app-color-text-secondary)'
          }
        }
      ]
})
