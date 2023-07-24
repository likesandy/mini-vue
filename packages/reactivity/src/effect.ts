import { isArray } from '@vue/shared'
import { Dep, createDep } from './dep'
import { ComputedRefImpl, computed } from './computer'

// type KeyToDepMap = Map<unknown, ReactiveEffect>
type KeyToDepMap = Map<unknown, Dep>

export type EffectScheduler = (...args: any[]) => any
/**
 * 收集所有依赖的 WeakMap 实例：
 * 1. `key`：响应性对象
 * 2. `value`：`Map` 对象
 * 		1. `key`：响应性对象的指定属性
 * 		2. `value`：指定对象的指定属性的 执行函数
 */
const targetMap = new WeakMap<object, KeyToDepMap>()

/**
 * 收集依赖
 * @param target
 * @param key
 */
export function track(target: object, key: string | symbol) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)

  if (!depsMap) targetMap.set(target, (depsMap = new Map()))

  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = createDep()))

  trackEffects(dep)
}

export function trackEffects(dep: Dep) {
  dep.add(activeEffect!)
}

/**
 * 触发依赖
 * @param target
 * @param value
 */
export function trigger(target: object, key: string | symbol, value: unknown) {
  const depsMap = targetMap.get(target)

  if (!depsMap) return

  const dep = depsMap.get(key)

  if (!dep) return

  triggerEffects(dep)
}

export function triggerEffects(dep: Dep) {
  const effects = isArray(dep) ? dep : [...dep]
  for (const effect of effects) {
    if (effect.computed) triggerEffect(effect)
  }
  for (const effect of effects) {
    if (!effect.computed) triggerEffect(effect)
  }
}

export function triggerEffect(effect: ReactiveEffect) {
  if (effect.scheduler) effect.scheduler()
  else effect.run()
}

export function effect<T>(fn: () => T) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

export class ReactiveEffect<T = any> {
  computed?: ComputedRefImpl<T>
  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null
  ) {}

  run() {
    activeEffect = this
    return this.fn()
  }

  stop() {}
}

/**
 * 单例的，当前的 effect
 */
export let activeEffect: ReactiveEffect | undefined
