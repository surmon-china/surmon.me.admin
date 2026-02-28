import { GeneralKeyValue } from '../general'
import { UserIdentity } from './identity'
import { UserType } from './type'

export interface User {
  _id: string
  id: number
  type: UserType
  name: string
  email: string | null
  website: string | null
  avatar_url: string | null
  identities: UserIdentity[]
  extras: GeneralKeyValue[]
  disabled: boolean
  created_at: string
  updated_at: string
}
