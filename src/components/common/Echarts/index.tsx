import React, { useEffect, useImperativeHandle, useRef } from 'react'
import * as echarts from 'echarts/core'
import { EChartsType } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import {
  LineChart,
  LineSeriesOption,
  LinesSeriesOption,
  BarChart,
  BarSeriesOption
} from 'echarts/charts'
import {
  GridComponent,
  GridComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  DataZoomComponent,
  DataZoomComponentOption
} from 'echarts/components'

// echarts features
echarts.use([
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  SVGRenderer,
  BarChart,
  LineChart
])

// echarts options
export type ChartOptions = echarts.ComposeOption<
  | DataZoomComponentOption
  | GridComponentOption
  | TooltipComponentOption
  | BarSeriesOption
  | LineSeriesOption
  | LinesSeriesOption
>

export interface ChartProps {
  className?: string
  style?: React.CSSProperties
  options: ChartOptions | null
}

export interface ChartRef {
  instance(): EChartsType | undefined
}

export const ECharts = React.forwardRef<ChartRef, ChartProps>((props, ref) => {
  const domRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<EChartsType | undefined>(undefined)

  const resizeChart = () => {
    chartRef.current?.resize({
      animation: { duration: 300 }
    })
  }

  useEffect(() => {
    if (domRef.current) {
      chartRef.current =
        echarts.getInstanceByDom(domRef.current) ??
        echarts.init(domRef.current, null, {
          renderer: 'svg'
        })

      if (props.options) {
        chartRef.current?.setOption(props.options)
      }
    }
  }, [domRef, props.options])

  useEffect(() => {
    window.addEventListener('resize', resizeChart)
    return () => {
      window.removeEventListener('resize', resizeChart)
      chartRef.current?.dispose()
      chartRef.current = undefined
    }
  }, [])

  useImperativeHandle(ref, () => ({
    instance: () => chartRef.current
  }))

  return <div ref={domRef} className={props.className} style={props.style} />
})
