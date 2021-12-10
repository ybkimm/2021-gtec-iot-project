/* global RequestInfo, RequestInit */

import { DependencyList, useEffect, useMemo, useRef, useState } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

export interface FetchParams<T> extends Omit<RequestInit, 'signal' | 'mode'> {
  saveMethod?: string
  handleResponse?: (resp: Response) => T | Promise<T>
  doInitialRequest?: boolean
}

const useFetch = <T>(
  req: string,
  paramsFactory: FetchParams<T> | ((isFirst: boolean) => FetchParams<T>),
  deps?: DependencyList):
  [T | null, boolean, unknown] => {
  const [response, setResponse] = useState<T | null>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>(null)
  const isFirstTime = useRef<boolean>(true)

  const params = useMemo(() => {
    const params = typeof paramsFactory === 'function'
      ? paramsFactory(isFirstTime.current)
      : paramsFactory
    return params
  }, [paramsFactory, isFirstTime.current])

  useDeepCompareEffect(() => {
    if (isFirstTime.current && params.doInitialRequest === false) {
      isFirstTime.current = false
      return
    }

    setLoading(true)

    console.log('fetch', req, params)
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
          setLoading(false)
        }
        return null
      })
      .then((v) => {
        if (controller.signal.aborted) {
          return null
        }
        setResponse(v)
      })
      .finally(() => {
        isFirstTime.current = false
      })

    return () => controller.abort()
  }, [req, params])

  return [
    response,
    isLoading,
    error
  ]
}
export default useFetch
