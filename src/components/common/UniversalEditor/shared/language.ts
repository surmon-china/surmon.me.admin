import _debounce from 'lodash/debounce'

export enum UnEditorLanguage {
  Markdown = 'markdown',
  JSON = 'json',
  YAML = 'yaml'
}

export const UnEditorLanguages = [
  {
    id: UnEditorLanguage.Markdown,
    name: 'Markdown',
    ext: 'md'
  },
  {
    id: UnEditorLanguage.JSON,
    name: 'JSON',
    ext: 'json'
  },
  {
    id: UnEditorLanguage.YAML,
    name: 'YAML',
    ext: 'yaml'
  }
]

export const UnEditorLanguageMap: ReadonlyMap<UnEditorLanguage, (typeof UnEditorLanguages)[0]> =
  new Map(UnEditorLanguages.map((item) => [item.id, item]))
