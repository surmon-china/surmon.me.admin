import React, { useRef, useEffect, useMemo } from 'react'
import { Compartment } from '@codemirror/state'
import { foldGutter } from '@codemirror/language'
import { EditorView, keymap, KeyBinding } from '@codemirror/view'
import CodeMirror, { Extension, oneDark } from '@uiw/react-codemirror'
import type { ReactCodeMirrorRef, Statistics } from '@uiw/react-codemirror'
import { languages as languageDescriptions } from '@codemirror/language-data'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { json as jsonLanguageSupport } from '@codemirror/lang-json'
import { yaml as yamlLanguageSupport } from '@codemirror/lang-yaml'
import { UnEditorLanguage } from './shared/language'
import unfoldSvgString from './icons/unfold.svg?raw'
import foldSvgString from './icons/fold.svg?raw'

// Calculating editor height using line-height
const row2Height = (rows: number) => `${rows * 20}px`

// Quickly generate Codemirror KeyBinding object
const getKeyBinding = (key: string, callback: () => void): KeyBinding => ({
  key,
  run: () => {
    callback()
    return true
  }
})

// Multi-language markdown support
const markdownLanguageSupport = markdown({
  base: markdownLanguage,
  codeLanguages: languageDescriptions
})

// Editor languages map
const languageExtensionsMap = new Map<UnEditorLanguage, Extension[]>([
  [UnEditorLanguage.JSON, [jsonLanguageSupport()]],
  [UnEditorLanguage.YAML, [yamlLanguageSupport()]],
  [UnEditorLanguage.Markdown, [markdownLanguageSupport]]
])

// Custom folding gutter icon
// https://discuss.codemirror.net/t/change-icon-for-gutter-code-folding/7085/4
const foldGutterClassName = 'folder-icon'
const foldingCompartment = new Compartment()
const foldingExtension = foldingCompartment.of(
  foldGutter({
    markerDOM: (open) => {
      const icon = document.createElement('span')
      icon.className = `${foldGutterClassName} ${open ? 'unfold' : 'fold'}`
      icon.innerHTML = open ? unfoldSvgString : foldSvgString
      return icon
    }
  })
)

// Overwrite theme style
const localOverwriteTheme = EditorView.theme({
  '&': { backgroundColor: 'var(--app-color-bg-container)' },
  '.cm-selectionMatch': { outline: '1px solid var(--app-color-text)' },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: 'var(--app-color-text-base)',
    borderWidth: '2px',
    marginLeft: 0
  },
  '.cm-gutters': {
    backgroundColor: 'var(--app-color-bg-elevated)',
    borderRight: '1px solid var(--app-color-border-secondary)'
  },
  '.cm-gutter.cm-lineNumbers': {
    color: 'var(--app-color-text-tertiary)',
    userSelect: 'none'
  },
  '.cm-lineNumbers .cm-gutterElement': {
    minWidth: '46px',
    paddingInline: '4px'
  },
  [`.cm-gutter.cm-foldGutter .${foldGutterClassName}`]: {
    display: 'inline-flex',
    paddingInline: '4px',
    cursor: 'pointer',
    color: 'var(--app-color-text-quaternary)',
    transition: 'color var(--app-motion-duration-fast)'
  },
  [[
    `.cm-gutter.cm-foldGutter .${foldGutterClassName}:hover`,
    `.cm-gutter.cm-foldGutter .${foldGutterClassName}.fold`
  ].join(',')]: {
    color: 'var(--app-color-text)'
  },
  [`.cm-gutter.cm-foldGutter .${foldGutterClassName} svg`]: {
    height: '19px'
  }
})

export interface EditorStates {
  length: number
  lineCount: number
  selectedCount: number
  selectedLength: number
}

export interface EditorCoreProps {
  className?: string
  style?: React.CSSProperties
  language: UnEditorLanguage
  value: string
  onChange(value?: string): void
  onStatesChange?(states: EditorStates): void
  onPressExitFullscreen?(): void
  onPressSave?(): void
  placeholder?: string
  rows?: number
  autoFocus?: boolean
  disbaled?: boolean
  darkTheme?: boolean
  disabledLineNumbers?: boolean
  disabledFoldGutter?: boolean
  isFullscreen?: boolean
  isPreviewing?: boolean
}

export const EditorCore: React.FC<EditorCoreProps> = (props) => {
  const cmInstance = useRef<ReactCodeMirrorRef>(null)

  // Editor language
  const languageExtensions = useMemo<Extension[]>(
    () => languageExtensionsMap.get(props.language) ?? [],
    [props.language]
  )

  // Editor key binding
  const keymapsExtension = useMemo<Extension>(() => {
    return keymap.of([
      getKeyBinding('Mod-s', () => props.onPressSave?.()),
      getKeyBinding('Escape', () => props.onPressExitFullscreen?.())
    ])
  }, [props.onPressSave, props.onPressExitFullscreen])

  // Convert react-codemirror Statistics to states
  const handleStatisticsChange = (statistics: Statistics) => {
    props.onStatesChange?.({
      length: statistics.length,
      lineCount: statistics.lineCount,
      selectedCount: statistics.selections.length,
      selectedLength: statistics.selections.reduce((acc, i) => acc + i.length, 0)
    })
  }

  // Focus again when fullscreen change
  useEffect(() => cmInstance.current?.view?.focus(), [props.isFullscreen])

  return (
    <CodeMirror
      ref={cmInstance}
      className={props.className}
      style={props.style}
      value={props.value}
      onChange={props.onChange}
      onStatistics={handleStatisticsChange}
      indentWithTab={true}
      placeholder={props.placeholder}
      autoFocus={props.autoFocus}
      editable={!props.disbaled}
      readOnly={props.disbaled}
      minHeight={props.isFullscreen ? 'auto' : props.rows ? 'auto' : row2Height(24)}
      maxHeight={props.isFullscreen ? 'none' : props.rows ? 'none' : row2Height(36)}
      height={props.isFullscreen ? '100%' : props.rows ? row2Height(props.rows) : 'auto'}
      theme={props.darkTheme ? [localOverwriteTheme, oneDark] : [localOverwriteTheme]}
      extensions={[
        keymapsExtension,
        ...languageExtensions,
        props.disabledFoldGutter ? [] : foldingExtension
      ]}
      basicSetup={{
        tabSize: 2,
        lineNumbers: !props.disabledLineNumbers,
        highlightActiveLineGutter: true,
        foldGutter: false,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
        rectangularSelection: true,
        crosshairCursor: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        closeBracketsKeymap: true,
        searchKeymap: true,
        foldKeymap: true,
        completionKeymap: true,
        lintKeymap: true
      }}
    />
  )
}
