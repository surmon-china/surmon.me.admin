/**
 * @file Global Author constant
 * @author Surmon <https://github.com/surmon-china>
 */

export enum CommentAuthorType {
  Guest = 'guest',
  User = 'user'
}

export enum GeneralAuthorType {
  Anonymous = 'anonymous',
  Guest = CommentAuthorType.Guest,
  User = CommentAuthorType.User
}

const AUTHOR_TYPE_NAME_MAP: Record<GeneralAuthorType, string> = {
  [GeneralAuthorType.Anonymous]: '匿名访客',
  [GeneralAuthorType.Guest]: '署名访客',
  [GeneralAuthorType.User]: '注册用户'
}

export const commentAuthorTypes = Object.values(CommentAuthorType).map((id) => ({
  id,
  name: AUTHOR_TYPE_NAME_MAP[id]
}))

export const generalAuthorTypes = Object.values(GeneralAuthorType).map((id) => ({
  id,
  name: AUTHOR_TYPE_NAME_MAP[id]
}))

export const getAuthorTypeName = (type: GeneralAuthorType | CommentAuthorType) => {
  return AUTHOR_TYPE_NAME_MAP[type]
}
