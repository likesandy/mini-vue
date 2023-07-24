/**
 * 判断是否是一个数组
 */
export const isArray = Array.isArray

export const isObject = (value: unknown): boolean =>
  value !== null && typeof value === 'object'

export const isFunction = (value: unknown): value is Function =>
  typeof value === 'function'

/**
 * 对比两个数据是否发生了改变
 */
export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)

/**
 * 空对象
 */
export const EMPTY_OBJ: { readonly [key: string]: any } = {}
