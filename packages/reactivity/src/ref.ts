import { Dep, createDep } from './dep'
import { activeEffect, trackEffects, triggerEffects } from './effect'
import { toReactive } from './reactive'

export interface Ref<T = unknown> {
  value: T
}

export function isRef(r: any): r is Ref {
  return !!(r && r.__v_isRef === true)
}

export function ref(value?: unknown) {
  return createRef(value)
}

export function createRef(value: unknown) {
  if (isRef(value)) return value

  return new RefImpl(value)
}

export class RefImpl<T> {
  private _value: T
  public dep?: Dep
  constructor(value: T) {
    this._value = toReactive(value)
  }

  get value() {
    trackRefValue(this)
    return this._value
  }
  set value(newValue: T) {
    this._value = newValue
    triggerRefValue(this)
  }
}

type RefBase<T> = {
  dep?: Dep
  value: T
}

export function trackRefValue(ref: RefBase<any>) {
  if (activeEffect) {
    trackEffects(ref.dep || (ref.dep = createDep()))
  }
}

export function triggerRefValue<T>(ref) {
  if (ref.dep) {
    triggerEffects(ref.dep)
  }
}
