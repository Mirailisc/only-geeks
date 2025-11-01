import { useMemo, useRef, useEffect } from 'react'

export function useDebounce<T extends (...args: never[]) => void>(fn: T, ms: number, maxWait?: number) {
  const funcRef = useRef(fn)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const maxWaitRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastInvokeTime = useRef<number | null>(null)
  const lastArgs = useRef<Parameters<T> | null>(null)

  funcRef.current = fn

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (maxWaitRef.current) clearTimeout(maxWaitRef.current)
    }
  }, [])

  return useMemo(() => {
    const invoke = () => {
      if (lastArgs.current) {
        funcRef.current(...lastArgs.current)
        lastArgs.current = null
        lastInvokeTime.current = Date.now()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (maxWaitRef.current) {
        clearTimeout(maxWaitRef.current)
        maxWaitRef.current = null
      }
    }

    const debounced = (...args: Parameters<T>) => {
      lastArgs.current = args

      if (!lastInvokeTime.current) {
        lastInvokeTime.current = Date.now()
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(invoke, ms)

      if (maxWait && !maxWaitRef.current) {
        maxWaitRef.current = setTimeout(invoke, maxWait)
      }
    }

    // 👇 Add lodash-like methods
    debounced.cancel = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (maxWaitRef.current) clearTimeout(maxWaitRef.current)
      timeoutRef.current = null
      maxWaitRef.current = null
      lastArgs.current = null
    }

    debounced.flush = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        invoke()
      }
    }

    return debounced as T & {
      cancel: () => void
      flush: () => void
    }
  }, [ms, maxWait])
}
