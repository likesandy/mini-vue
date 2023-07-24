/**
 * 判断是否是一个数组
 */
export const isArray = Array.isArray

export const isObject = (value: unknown): boolean =>
  value !== null && typeof value === 'object'

export const isFunction = (value: unknown): value is Function =>
  typeof value === 'function'
