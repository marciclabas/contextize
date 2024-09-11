import { useCallback, useEffect, useState } from "react"
import { contextize } from "./context.js"

export type DebugCtx = {
  get(key: string, value: unknown): unknown | null
  set(key: string, value: unknown): void
  refresh(): void
}

export type Store<T> = {
  get(): T | null
  set(value: T): void
}

export function browserStore<T>(key: string, storage: Storage = localStorage): Store<T> {
  return {
    get() {
      const item = storage.getItem(key)
      return item ? JSON.parse(item) : null
    },
    set(value) {
      storage.setItem(key, JSON.stringify(value))
    }
  }
}

export type Props<T = any> = {
  store: Store<T>
}
function useDebugCtl<T>({ store }: Props<T>): DebugCtx {
  const [state, setState] = useState({})

  const set = useCallback((key: string, val: T) => {
    const curr = store.get() ?? {}
    const next = { ...curr, [key]: val }
    console.log('Current:', curr, 'Next:', next)
    store.set(next as T)
    setState(s => ({ ...s, [key]: val }))
  }, [store])

  const get = useCallback((key: string, val: T) => {
    return state[key] !== undefined ? state[key] : val
  }, [state])

  const refresh = useCallback(() => {
    const next = store.get() ?? {}
    setState(next as Record<string, T>)
  }, [store])

  return { get, set, refresh }
}

const emptyCtx: DebugCtx = {
  get: () => null,
  set: () => {},
  refresh: () => {}
}

export const debug = contextize<DebugCtx, Props>(useDebugCtl, emptyCtx)

export function useDebugged<T>(val: T, key: string): T {
  const { get, set } = debug.use()
  useEffect(() => set(key, val), [val, set, key])
  return (get(key, val) ?? val) as T
}

export function debugged<Ps extends any[], T>(use: (...args: Ps) => T, key: string) {
  return (...args: Ps): T => {
    return useDebugged(use(...args), key)
  }
}