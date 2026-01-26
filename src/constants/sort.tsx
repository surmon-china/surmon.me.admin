/**
 * @file General sort modes
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icons from '@ant-design/icons'

export enum SortOrder {
  Asc = 1, // 升序
  Desc = -1 // 降序
}

export enum SortMode {
  Oldest = SortOrder.Asc,
  Latest = SortOrder.Desc,
  Hottest = 2
}

const sortModes = [
  {
    id: SortMode.Latest,
    name: '最新',
    icon: <Icons.SortDescendingOutlined />
  },
  {
    id: SortMode.Oldest,
    name: '最早',
    icon: <Icons.SortAscendingOutlined />
  },
  {
    id: SortMode.Hottest,
    name: '最热',
    icon: <Icons.FireOutlined />
  }
]

const sortModesMap = new Map(sortModes.map((item) => [item.id, item]))

export const getSortMode = (id: number) => {
  return sortModesMap.get(id)!
}
