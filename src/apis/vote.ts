/**
 * @file Vote
 * @author Surmon <https://github.com/surmon-china>
 */

import { ResponsePaginationData, GeneralPaginateQueryParams } from '@/constants/nodepress'
import { Vote, VoteTargetType, VoteType } from '@/constants/vote'
import { GeneralAuthorType } from '@/constants/author'
import { SortOrder } from '@/constants/sort'
import nodepress from '@/services/nodepress'

export const VOTE_API_PATH = '/votes'

export interface GetVotesParams extends GeneralPaginateQueryParams {
  target_type?: VoteTargetType
  target_id?: number
  vote_type?: VoteType
  author_type?: GeneralAuthorType
  sort?: SortOrder
}

export function getVotes(params: GetVotesParams = {}) {
  return nodepress
    .get<ResponsePaginationData<Vote>>(VOTE_API_PATH, { params })
    .then((response) => response.result)
}

export function deleteVotes(voteIds: number[]) {
  return nodepress
    .delete(VOTE_API_PATH, { data: { vote_ids: voteIds } })
    .then((response) => response.result)
}
