/**
 * @file Comment
 * @author Surmon <https://github.com/surmon-china>
 */

import { ResponsePaginationData, GeneralPaginateQueryParams } from '@/constants/nodepress'
import { Comment, CommentStatus } from '@/constants/comment'
import { SortMode } from '@/constants/sort'
import nodepress from '@/services/nodepress'

export const COMMENT_API_PATH = '/comments'

/** 获取评论参数 */
export interface GetCommentsParams extends GeneralPaginateQueryParams {
  keyword?: string
  target_id?: number
  status?: CommentStatus
  sort?: SortMode
}

/** 获取评论列表 */
export function getComments(params: GetCommentsParams = {}) {
  return nodepress
    .get<ResponsePaginationData<Comment>>(COMMENT_API_PATH, { params })
    .then((response) => response.result)
}

/** 获取评论详情 */
export function getComment(commentId: number) {
  return nodepress
    .get<Comment>(`${COMMENT_API_PATH}/${commentId}`)
    .then((response) => response.result)
}

/** 更新评论 */
export function updateComment(comment: Comment): Promise<any> {
  return nodepress
    .patch<Comment>(`${COMMENT_API_PATH}/${comment.id}`, comment)
    .then((response) => response.result)
}

/** 更新评论状态 */
export function updateCommentsStatus(commentIds: number[], status: CommentStatus) {
  return nodepress
    .patch(`${COMMENT_API_PATH}/status`, { comment_ids: commentIds, status })
    .then((response) => response.result)
}

/** 批量认领评论 */
export function claimCommentsUser(commentIds: number[], userId: number) {
  return nodepress
    .patch(`${COMMENT_API_PATH}/claim`, { comment_ids: commentIds, user_id: userId })
    .then((response) => response.result)
}

/** 批量删除评论 */
export function deleteComments(commentIds: number[]) {
  return nodepress
    .delete(COMMENT_API_PATH, { data: { comment_ids: commentIds } })
    .then((response) => response.result)
}
