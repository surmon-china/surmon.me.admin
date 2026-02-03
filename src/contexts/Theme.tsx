/**
 * @desc Global theme
 * @author Surmon <https://github.com/surmon-china>
 */

import React, { useState, useContext, useMemo } from 'react'

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

export const isDarkTheme = (t: Theme) => t === Theme.Dark
export const isLightTheme = (t: Theme) => t === Theme.Light

export interface IThemeContext {
  theme: Theme
  isDark: boolean
  isLight: boolean
  setTheme(theme: Theme): void
  toggleTheme(): void
}

export const ThemeContext = React.createContext({} as IThemeContext)
export const useTheme = () => useContext(ThemeContext)

export interface ThemeProviderProps extends React.PropsWithChildren {
  initialTheme: Theme
  onChange?(theme: Theme): void
}

export const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
  const [theme, _setTheme] = useState<Theme>(props.initialTheme)
  const isDark = useMemo(() => isDarkTheme(theme), [theme])
  const isLight = useMemo(() => isLightTheme(theme), [theme])

  const setTheme = (theme: Theme) => {
    props.onChange?.(theme)
    _setTheme(theme)
  }

  const toggleTheme = () => {
    setTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark)
  }

  const context = {
    theme,
    isDark,
    isLight,
    setTheme,
    toggleTheme
  }

  return <ThemeContext.Provider value={context}>{props.children}</ThemeContext.Provider>
}
