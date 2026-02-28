import React from 'react'
import * as Icons from '@ant-design/icons'

export enum UserType {
  Moderator = 1,
  Standard = 2,
  Patron = 3
}

export const userTypes = [
  {
    id: UserType.Moderator,
    name: '博主',
    icon: <Icons.UserOutlined />
  },
  {
    id: UserType.Standard,
    name: '普通用户',
    icon: <Icons.TeamOutlined />
  },
  {
    id: UserType.Patron,
    name: '特别用户',
    icon: <Icons.TeamOutlined />
  }
]

const userTypesMap = new Map(userTypes.map((item) => [item.id, item]))

export const getUserType = (userType: UserType) => {
  return userTypesMap.get(userType)!
}
