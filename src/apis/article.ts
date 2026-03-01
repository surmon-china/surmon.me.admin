/**
 * @file Article
 * @author Surmon <https://github.com/surmon-china>
 */

import { SortMode } from '@/constants/sort'
import type { Article } from '@/constants/article'
import { ArticleOrigin, ArticleStatus } from '@/constants/article'
import { ResponsePaginationData, GeneralPaginateQueryParams } from '@/constants/nodepress'
import nodepress from '@/services/nodepress'

export const ARTICLE_API_PATH = '/articles'

/** 获取文章参数 */
export interface GetArticleParams extends GeneralPaginateQueryParams {
  featured?: boolean
  sort?: SortMode
  status?: ArticleStatus
  origin?: ArticleOrigin
  keyword?: string
  tag_slug?: string
  category_slug?: string
}

/** 获取文章列表 */
export function getArticles(params: GetArticleParams = {}) {
  return nodepress
    .get<ResponsePaginationData<Article>>(ARTICLE_API_PATH, { params })
    .then((response) => response.result)
}

/** 获取全量文章 */
export function getAllArticles(params?: Record<string, any>) {
  return nodepress
    .get<Array<Article>>(`${ARTICLE_API_PATH}/all`, { params })
    .then((response) => response.result)
}

/** 获取文章详情 */
export function getArticleDetail(articleId: number) {
  return nodepress
    .get<Article>(`${ARTICLE_API_PATH}/${articleId}`)
    .then((response) => response.result)
}

/** 创建文章 */
export function createArticle(article: Article) {
  return nodepress.post<Article>(ARTICLE_API_PATH, article).then((response) => response.result)
}

/** 修改文章 */
export function updateArticle(article: Article) {
  return nodepress
    .patch<Article>(`${ARTICLE_API_PATH}/${article.id}`, article)
    .then((response) => response.result)
}

/** 删除文章 */
export function deleteArticle(articleId: number) {
  return nodepress.delete(`${ARTICLE_API_PATH}/${articleId}`).then((response) => response.result)
}

/** 批量修改文章状态 */
export function updateArticlesStatus(articleIds: number[], status: ArticleStatus) {
  return nodepress
    .patch(ARTICLE_API_PATH, { article_ids: articleIds, status })
    .then((response) => response.result)
}
