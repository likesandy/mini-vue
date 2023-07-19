/**
 * 收集依赖
 * @param target
 * @param key
 */

type KeyToDepMap = Map<unknown, ReactiveEffect>
const targetMap = new WeakMap<object, KeyToDepMap>()

/**
 * 收集所有依赖的 WeakMap 实例：
 * 1. `key`：响应性对象
 * 2. `value`：`Map` 对象
 * 		1. `key`：响应性对象的指定属性
 * 		2. `value`：指定对象的指定属性的 执行函数
 */
export function track(target: object, key: string | symbol) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)

  if (!depsMap) targetMap.set(target, (depsMap = new Map()))
}

export function effect<T = unknown>(fn: () => T) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

export class ReactiveEffect<T = unknown> {
  constructor(public fn: () => T) {}

  run() {
    this.fn()
  }
}

/**
 * 触发依赖
 * @param target
 * @param value
 */
export function trigger(target: object, value: unknown) {
  console.log('trigger触发依赖')
}

/**
 * 单例的，当前的 effect
 */
export let activeEffect: ReactiveEffect | undefined
