/**
 * @file Comment target
 * @author Surmon <https://github.com/surmon-china>
 */

export enum CommentTargetType {
  Article = 'article',
  Page = 'page'
}

export const commentTargetTypes = [
  {
    id: CommentTargetType.Article,
    name: '文章'
  },
  {
    id: CommentTargetType.Page,
    name: '页面'
  }
]

const commentTargetTypesMap = new Map(commentTargetTypes.map((item) => [item.id, item]))

export const getCommentTargetType = (targetType: CommentTargetType) => {
  return commentTargetTypesMap.get(targetType)!
}
