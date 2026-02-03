/**
 * @desc General JSON editor in Modal
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Modal, message } from 'antd'
import { getUnEditorWithProviders, UnEditorLanguage } from '../UniversalEditor'
import { Language } from '@/contexts/Locale'
import { Theme } from '@/contexts/Theme'
import { i18n } from '@/i18n'

export interface ModalJsonEditorOptions {
  title: string
  initLanguage: Language
  initialTheme: Theme
  initialValue: Record<string, any>
  callback: (data: Record<string, any>) => any
}

export function openJSONEditor(options: ModalJsonEditorOptions) {
  let data: string | undefined = JSON.stringify(options.initialValue, null, 2)
  const EditorComponent = getUnEditorWithProviders({
    initialTheme: options.initialTheme,
    initialLanguage: options.initLanguage
  })

  return Modal.confirm({
    width: '60vw',
    title: options.title,
    icon: null,
    centered: true,
    closable: true,
    okText: i18n.t('component.modal_json_editor.save'),
    content: (
      <div style={{ display: 'grid', width: '100%' }}>
        <EditorComponent
          value={data}
          onChange={(value) => (data = value)}
          placeholder={i18n.t('component.modal_json_editor.placeholder')}
          defaultLanguage={UnEditorLanguage.JSON}
          disabledToolbar={true}
          disabledStatesBar={true}
          disabledCacheDraft={true}
          rows={24}
        />
      </div>
    ),
    onOk() {
      try {
        return options.callback(JSON.parse(data!))
      } catch (error) {
        const msg = i18n.t('component.modal_json_editor.error')
        message.error(msg)
        return Promise.reject(msg)
      }
    }
  })
}
