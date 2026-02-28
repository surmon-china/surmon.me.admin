/**
 * @file URL transform
 * @author Surmon <https://github.com/surmon-china>
 */

import { BLOG_BASE_URL, APP_BASE_URL } from '@/config'

export const getResourceUrl = (uri: string) => {
  const path = APP_BASE_URL.endsWith('/') ? APP_BASE_URL : `${APP_BASE_URL}/`
  return uri.startsWith('/') ? path + uri.substring(1, uri.length) : path + uri
}

export const getBlogUrl = (uri: string) => {
  return `${BLOG_BASE_URL}${uri}`
}

export const BLOG_ARTICLE_URL_PREFIX = `${BLOG_BASE_URL}/article/`
export const getBlogArticleUrl = (articleId: number) => {
  return `${BLOG_ARTICLE_URL_PREFIX}${articleId}`
}

export const getBlogTagUrl = (tagSlug: string) => {
  return `${BLOG_BASE_URL}/tag/${tagSlug}`
}

export const getBlogCategoryUrl = (categorySlug: string) => {
  return `${BLOG_BASE_URL}/category/${categorySlug}`
}

export const getBlogGuestbookUrl = () => {
  return `${BLOG_BASE_URL}/guestbook`
}

export const getBlogURLByPostId = (postId: number) => {
  // TODO: 做一些映射
  return ''
  // return postId === COMMENT_GUESTBOOK_POST_ID ? getBlogGuestbookUrl() : getBlogArticleUrl(postId)
}
