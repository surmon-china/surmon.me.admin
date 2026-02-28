/**
 * @file User
 * @author Surmon <https://github.com/surmon-china>
 */

import { User, UserType, UserIdentityProvider } from '@/constants/user'
import { ResponsePaginationData, GeneralPaginateQueryParams } from '@/constants/nodepress'
import nodepress from '@/services/nodepress'

export const USER_API_PATH = '/users'

/** 获取用户参数 */
export interface GetUsersParams extends GeneralPaginateQueryParams {
  /** 搜索关键词 */
  keyword?: string
  /** 用户类型 */
  type?: UserType
  /** 是否禁用 */
  disabled?: boolean
}

/** 获取用户列表 */
export function getUsers(params: GetUsersParams = {}) {
  return nodepress
    .get<ResponsePaginationData<User>>(USER_API_PATH, { params })
    .then((response) => response.result)
}

/** 获取用户详情 */
export function getUser(id: number) {
  return nodepress.get<User>(`${USER_API_PATH}/${id}`).then((response) => response.result)
}

/** 添加用户 */
export function createUser(user: User): Promise<any> {
  return nodepress.post<User>(USER_API_PATH, user).then((response) => response.result)
}

/** 更新用户 */
export function updateUser(user: User): Promise<User> {
  return nodepress
    .patch<User>(`${USER_API_PATH}/${user.id}`, user)
    .then((response) => response.result)
}

/** 移除用户 OAuth 绑定 */
export function deleteUserIdentity(id: number, provider: UserIdentityProvider) {
  return nodepress
    .delete<User>(`${USER_API_PATH}/${id}/identities/${provider}`)
    .then((response) => response.result)
}

/** 删除用户 */
export function deleteUser(id: number) {
  return nodepress.delete<User>(`${USER_API_PATH}/${id}`).then((response) => response.result)
}
