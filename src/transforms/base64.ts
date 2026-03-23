/**
 * @file Base64 and Base64URL utilities
 * @module transform/base64
 * @author Surmon <https://github.com/surmon-china>
 */

export const base64Encode = (input: string) => btoa(encodeURIComponent(input))
export const base64Decode = (input: string) => decodeURIComponent(atob(input))
