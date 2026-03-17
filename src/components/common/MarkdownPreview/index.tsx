/**
 * @desc General Markdown preview
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import classnames from 'classnames'
import marked from './marked'

import './style.global.less'

export interface MarkdownPreviewProps {
  markdown?: string
  className?: string
  style?: React.CSSProperties
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = (props) => {
  return (
    <div style={props.style} className={classnames('markdown-preview', props.className)}>
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{
          __html: marked(props.markdown ?? '')
        }}
      />
    </div>
  )
}
