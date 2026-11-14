/**
 * @desc Global admin profile state
 * @author Surmon <https://github.com/surmon-china>
 */

import React, { useState, useContext } from 'react'
import { AdminProfile } from '@/constants/admin'
import { getAdminProfile } from '@/apis/admin'
import { getResourceUrl } from '@/transforms/url'

const DEFAULT_ADMIN_PROFILE: AdminProfile = Object.freeze({
  name: 'Admin',
  slogan: 'NodePress',
  avatar_url: getResourceUrl('/images/nodepress.png')
})

export interface IAdminProfileContext {
  data: AdminProfile
  loading: boolean
  refresh(): Promise<void>
}

export const AdminProfileContext = React.createContext({} as IAdminProfileContext)
export const useAdminProfile = () => useContext(AdminProfileContext)

export const AdminProfileProvider: React.FC<React.PropsWithChildren> = (props) => {
  const [data, setData] = useState<AdminProfile>({ ...DEFAULT_ADMIN_PROFILE })
  const [loading, setLoading] = useState(false)

  const refresh = async () => {
    try {
      setLoading(true)
      setData(await getAdminProfile())
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminProfileContext.Provider value={{ data, loading, refresh }}>
      {props.children}
    </AdminProfileContext.Provider>
  )
}
