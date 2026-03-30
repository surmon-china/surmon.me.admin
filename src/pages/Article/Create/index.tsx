/**
 * @file Article create page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useNavigate } from 'react-router'
import { useLoading } from 'veact-use'
import { getArticleDetailRoutePath } from '@/routes'
import { Article } from '@/constants/article'
import { scrollToTop } from '@/utils/scroll'
import { ArticleEditor } from '../Editor'
import * as api from '@/apis/article'

export const ArticleCreatePage: React.FC = () => {
  const navigate = useNavigate()
  const creating = useLoading()
  const createArticle = (article: Article) => {
    return creating.promise(api.createArticle(article)).then((result) => {
      navigate(getArticleDetailRoutePath(result.id))
      scrollToTop()
    })
  }

  return (
    <ArticleEditor
      loading={false}
      article={null}
      editorCacheId="article-new"
      submitting={creating.state.value}
      onSubmit={(article) => createArticle(article)}
    />
  )
}
