/**
 * @file BIZ key value transformer
 * @author Surmon <https://github.com/surmon-china>
 */

import { GeneralKeyValue } from '@/constants/general'

export const getKeyValueObject = (kvs: GeneralKeyValue[]): { [key: string]: string } => {
  return kvs.length ? kvs.reduce((v, c) => ({ ...v, [c.key]: c.value }), {}) : {}
}

export const getKeyValue = (kvs: GeneralKeyValue[], key: string): string | void => {
  return kvs.length ? getKeyValueObject(kvs)[key] : void 0
}
