/**
 * @file Avatar URL
 * @author Surmon <https://github.com/surmon-china>
 */

import { Comment } from '@/constants/comment'
import { getDisqusUserName } from './disqus'

export const getGravatar = (emailhash: string) => {
  // https://en.gravatar.com/site/implement/images/
  return `https://www.gravatar.com/avatar/${emailhash}`
}

export const getDisqusAvatar = (username: string) => {
  // https://disqus.com/api/docs/images/
  return `https://disqus.com/api/users/avatars/${username}.jpg`
}

export const autoCommentAvatar = (comment: Comment) => {
  if (comment.author.email_hash) {
    return getGravatar(comment.author.email_hash)
  }

  const disqusUsername = getDisqusUserName(comment.extras)
  if (disqusUsername) {
    return getDisqusAvatar(disqusUsername)
  }

  return ''
}
