/**
 * @desc Global Antd config
 * @author Surmon <https://github.com/surmon-china>
 */

import React, { useLayoutEffect, useMemo } from 'react'
import { ConfigProvider, theme as antdTheme } from 'antd'
import type { ConfigProviderProps } from 'antd'
import type { Locale as Locale } from 'antd/es/locale'

import * as CONFIG from '@/config'
import { locales } from '@/locales'
import { useTheme } from './Theme'
import { useLocale } from './Locale'

interface ConfigProviderOptions {
  isDarkTheme: boolean
  locale: Locale
}

const getConfigProviderProps = (options: ConfigProviderOptions): ConfigProviderProps => ({
  locale: options.locale,
  space: { size: CONFIG.APP_CONTENT_SPACE_SIZE },
  theme: {
    hashed: false,
    cssVar: { prefix: 'app' },
    algorithm: options.isDarkTheme ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: CONFIG.APP_PRIMARY_COLOR,
      fontFamily: 'inherit'
    }
  }
})

// https://ant.design/components/config-provider-cn#configproviderconfig
// https://ant.design/components/config-provider-cn#config-provider-demo-holderrender
const setAntdGlobalHolderConfig = (props: ConfigProviderProps) => {
  ConfigProvider.config({
    holderRender(children) {
      return <ConfigProvider {...props}>{children}</ConfigProvider>
    }
  })
}

export const AntdConfigProvider: React.FC<React.PropsWithChildren> = (props) => {
  const { isDark } = useTheme()
  const { language } = useLocale()

  const antdLocale = useMemo<Locale>(() => locales[language].antd, [language])
  const antdConfigProviderProps = useMemo(() => {
    return getConfigProviderProps({ isDarkTheme: isDark, locale: antdLocale })
  }, [isDark, antdLocale])

  // Set global ConfigProvider when config changed.
  useLayoutEffect(() => {
    setAntdGlobalHolderConfig(antdConfigProviderProps)
  }, [antdConfigProviderProps])

  return <ConfigProvider {...antdConfigProviderProps}>{props.children}</ConfigProvider>
}
