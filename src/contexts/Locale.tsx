/**
 * @desc Global locale language
 * @author Surmon <https://github.com/surmon-china>
 */

import React, { useState, useContext } from 'react'

// https://www.ruanyifeng.com/blog/2008/02/codes_for_language_names.html
// https://juejin.cn/post/6844904099859841038
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages
// https://datatracker.ietf.org/doc/html/rfc5646
// https://gist.github.com/msikma/8912e62ed866778ff8cd
export enum Language {
  English = 'en-US',
  SimplifiedChinese = 'zh-CN',
  TraditionalChinese = 'zh-TW'
}

export const languages: Array<{ code: string; name: string }> = [
  {
    code: Language.English,
    name: 'English'
  },
  {
    code: Language.SimplifiedChinese,
    name: '简体中文'
  },
  {
    code: Language.TraditionalChinese,
    name: '繁体中文'
  }
]

export interface LocaleContext {
  language: Language
  changeLanguage(language: Language): void
}

export const LocaleContext = React.createContext({} as LocaleContext)
export const useLocale = () => useContext(LocaleContext)

export interface LocaleProviderProps extends React.PropsWithChildren {
  initialLanguage: Language
  onChange?(language: Language): void | Promise<any>
}

export const LocaleProvider: React.FC<LocaleProviderProps> = (props) => {
  const [language, setLanguage] = useState<Language>(props.initialLanguage)
  const changeLanguage = (value: Language) => {
    const result = props.onChange?.(value)
    if (result instanceof Promise) {
      result.then(() => setLanguage(value))
    } else {
      setLanguage(value)
    }
  }

  return (
    <LocaleContext.Provider value={{ language, changeLanguage }}>
      {props.children}
    </LocaleContext.Provider>
  )
}
