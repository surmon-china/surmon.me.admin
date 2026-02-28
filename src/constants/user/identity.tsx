import React from 'React'
import * as Icons from '@ant-design/icons'

export enum UserIdentityProvider {
  GitHub = 'github',
  Google = 'google'
}

export interface UserIdentity {
  provider: UserIdentityProvider
  uid: string
  email: string | null
  username: string | null
  display_name: string | null
  avatar_url: string | null
  profile_url: string | null
  linked_at: string
}

export interface IdentityListItem {
  provider: UserIdentityProvider
  title: string
  icon: React.ReactElement
  linked: boolean
  displayId: string | null
  originalData: UserIdentity | null
}

export const getUserIdentityList = (identities: UserIdentity[]): IdentityListItem[] => {
  const github = identities.find((id) => id.provider === UserIdentityProvider.GitHub)
  const google = identities.find((id) => id.provider === UserIdentityProvider.Google)

  return [
    {
      title: 'GitHub',
      icon: <Icons.GithubFilled />,
      provider: UserIdentityProvider.GitHub,
      linked: !!github,
      displayId: github?.username || github?.display_name || null,
      originalData: github || null
    },
    {
      title: 'Google',
      icon: <Icons.GoogleCircleFilled />,
      provider: UserIdentityProvider.Google,
      linked: !!google,
      displayId: google?.email || google?.display_name || null,
      originalData: google || null
    }
  ]
}
