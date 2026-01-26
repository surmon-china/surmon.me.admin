/**
 * @file Options interface
 * @author Surmon <https://github.com/surmon-china>
 */

export interface Options {
  title: string
  sub_title: string
  description: string
  keywords: string[]
  statement: string
  site_url: string
  site_email: string
  blocklist: {
    ips: string[]
    mails: string[]
    keywords: string[]
  }
  friend_links: Array<{ name: string; url: string }>
  app_config: string
  updated_at: string
}
