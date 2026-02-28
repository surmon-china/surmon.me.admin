import classnames from 'classnames'
import React, { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/Theme'
import { saveFile } from '@/utils/file'
import { timestampToYMD } from '@/transforms/date'
import { MarkdownPreview } from '@/components/common/MarkdownPreview'
import { UnEditorLanguage, UnEditorLanguageMap } from './shared/language'
import { setUnEditorCache } from './shared/cache'
import { EditorCore, EditorStates } from './Core'
import { EditorToolbar } from './Toolbar'
import { EditorStatesBar } from './StatesBar'

import styles from './style.module.less'

export interface UniversalEditorProps {
  style?: React.CSSProperties
  value?: string
  onChange?(value?: string): void
  placeholder?: string
  /** Disable editor input */
  disbaled?: boolean
  /** Auto focus when editor mounted */
  autoFocus?: boolean
  /** Number of fixed rows (height) for editor */
  rows?: number
  /** Unique ID for editor, default: `window.location.pathname` */
  eid?: string
  /** Initial code language */
  defaultLanguage?: UnEditorLanguage
  /** Disable the top toolbar */
  disabledToolbar?: boolean
  /** Disable the code language selector */
  disabledLanguageSelect?: boolean
  /** Disable the bottom status bar */
  disabledStatesBar?: boolean
  /** Disable the side line numbers */
  disabledLineNumbers?: boolean
  /** Disable the side gutter folding */
  disabledFoldGutter?: boolean
  /** Disable draft caching */
  disabledCacheDraft?: boolean
  /** Custom rendering for Toolbar extra */
  renderToolbarExtra?(language: UnEditorLanguage): React.ReactNode
  /** Respond to Form status on the UI */
  formStatus?: boolean
}

export const UniversalEditor: React.FC<UniversalEditorProps> = (props) => {
  const propValue = props.value ?? ''
  const editorId = props.eid || window.location.pathname
  const theme = useTheme()
  const [editorStates, setEditorStates] = useState<EditorStates>()
  const [isFullscreen, setFullscreen] = useState<boolean>(false)
  const [isPreviewing, setPreviewing] = useState<boolean>(false)
  const [language, setLanguage] = useState<UnEditorLanguage>(
    props.defaultLanguage || UnEditorLanguage.Markdown
  )

  const handleContentChange = (newValue?: string) => {
    if (!props.disabledCacheDraft) {
      setUnEditorCache(editorId, newValue || '')
    }
    props.onChange?.(newValue)
  }

  const handleStatesChange = (states: EditorStates) => {
    if (JSON.stringify(states) !== JSON.stringify(editorStates)) {
      setEditorStates(states)
    }
  }

  const saveContentToFile = () => {
    const time = timestampToYMD(Date.now())
    const fileExt = UnEditorLanguageMap.get(language)!.ext
    const fileName = `${editorId}-${time}.${fileExt}`
    saveFile(propValue, fileName)
  }

  // effects when fullscreen change
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.removeProperty('overflow-y')
    }
  }, [isFullscreen])

  return (
    <div
      style={props.style}
      className={classnames(
        styles.universalEditor,
        isFullscreen && styles.fullScreen,
        props.formStatus && styles.formStatus
      )}
    >
      {!props.disabledToolbar && (
        <EditorToolbar
          title="UnEditor"
          disbaled={props.disbaled}
          language={language}
          isFullscreen={isFullscreen}
          isPreviewing={isPreviewing}
          disabledLanguageSelect={props.disabledLanguageSelect}
          onFullscreenChange={setFullscreen}
          onPreviewingChange={setPreviewing}
          onLanguageChange={setLanguage}
          onPressSaveContent={() => saveContentToFile()}
          renderToolbarExtra={props.renderToolbarExtra}
        />
      )}
      <div className={styles.editorWrapper}>
        <EditorCore
          className={styles.editorCore}
          style={{ width: isPreviewing ? '50%' : '100%' }}
          value={propValue}
          language={language}
          onChange={handleContentChange}
          onStatesChange={handleStatesChange}
          onPressExitFullscreen={() => setFullscreen(false)}
          onPressSave={() => saveContentToFile()}
          isFullscreen={isFullscreen}
          isPreviewing={isPreviewing}
          darkTheme={theme.isDark}
          rows={props.rows}
          placeholder={props.placeholder}
          autoFocus={props.autoFocus}
          disbaled={props.disbaled}
          disabledLineNumbers={props.disabledLineNumbers}
          disabledFoldGutter={props.disabledFoldGutter}
        />
        {isPreviewing && (
          <MarkdownPreview className={styles.editorPreview} markdown={propValue} />
        )}
      </div>
      {!props.disabledStatesBar && (
        <EditorStatesBar
          id={editorId}
          states={editorStates}
          enabledCache={!props.disabledCacheDraft}
        />
      )}
    </div>
  )
}
