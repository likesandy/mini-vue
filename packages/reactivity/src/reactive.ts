import { isObject } from '@vue/shared'
import { mutableHandlers } from './baseHandle'

export const reactiveMap = new WeakMap<object, unknown>()

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

export const toReactive = <T>(value: T): T =>
  isObject(value) ? reactive(value as object) : value

export function reactive(target: object) {
  return createReactiveObject(target, mutableHandlers, reactiveMap)
}

function createReactiveObject(
  target: object,
  baseHandle: ProxyHandler<object>,
  proxyMap: WeakMap<object, any>
) {
  // 如果该实例已经被代理，则直接读取即可
  const existingProxy = proxyMap.get(target)

  // 如果该实例已经被代理，则直接返回
  if (existingProxy) return existingProxy

  // 未被代理则生成 proxy 实例
  const proxy = new Proxy(target, baseHandle)
  proxy[ReactiveFlags.IS_REACTIVE] = true

  // 缓存代理对象
  proxyMap.set(target, proxy)
  return proxy
}

/**
 * 是否是reactive对象
 */
export const isReactive = (value): boolean => {
  return !!(value && value[ReactiveFlags.IS_REACTIVE])
}
