/* global RequestInit */

import { DependencyList, useEffect, useMemo, useRef, useState } from 'react'

export interface FetchParams<T> extends Omit<RequestInit, 'signal' | 'mode'> {
  handleResponse?: (resp: Response) => T | Promise<T>
  doInitialRequest?: boolean
}

const useFetch = <T>(
  reqFactory: string | ((isFirst: boolean) => string),
  paramsFactory: FetchParams<T> | ((isFirst: boolean) => FetchParams<T>),
  deps?: DependencyList):
  [T | null, boolean, unknown] => {
  const [response, setResponse] = useState<T | null>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>(null)
  const isFirstTime = useRef<boolean>(true)

  const req = useMemo(() => {
    const req = typeof reqFactory === 'function'
      ? reqFactory(isFirstTime.current)
      : reqFactory
    return req
  }, [reqFactory, isFirstTime.current])

  const params = useMemo(() => {
    const params = typeof paramsFactory === 'function'
      ? paramsFactory(isFirstTime.current)
      : paramsFactory
    return params
  }, [paramsFactory, isFirstTime.current])

  useEffect(() => {
    if (isFirstTime.current && params.doInitialRequest === false) {
      isFirstTime.current = false
      return
    }

    setLoading(true)

    const controller = new AbortController()
    fetch(req, {
      ...params,
      mode: 'cors',
      signal: controller.signal
    })
      .then((resp) => {
        setLoading(false)
        if (params.handleResponse != null) {
          return params.handleResponse(resp)
        }
        return resp.json() as Promise<T>
      }, (err) => {
        if (!controller.signal.aborted) {
          setError(err)
          setResponse(null)
          setLoading(false)
        }
        return null
      })
      .then((v) => {
        if (controller.signal.aborted) {
          return null
        }
        setResponse(v)
        setError(null)
      })
      .finally(() => {
        isFirstTime.current = false
      })

    return () => controller.abort()
  }, deps)

  return [
    response,
    isLoading,
    error
  ]
}
export default useFetch
