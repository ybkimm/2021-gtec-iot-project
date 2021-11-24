import React, {
  ReactElement, ReactNode,
  useEffect, useMemo,
  useState
} from 'react'
import { ColorScheme } from './internal/colorscheme'
import init from './internal/init'

interface AppProps {
  children?: ReactNode
  colorScheme?: ColorScheme
}

export default function AppWrapper (props: AppProps): ReactElement {
  // Init
  const [inited, setInitState] = useState(false)

  useEffect(() => {
    init()
      .then(() => setInitState(true))
      .catch((e) => console.error(e))
  }, [])

  // Color Scheme
  const [colorScheme, setColorScheme]
    = useState<ColorScheme>(props.colorScheme || 'light')

  const mql = useMemo(
    () => window.matchMedia('(prefers-color-scheme: dark)'),
    []
  )

  useEffect(() => {
    if (props.colorScheme != null) {
      setColorScheme(props.colorScheme)
      return
    }

    const handleSystemColorSchemeChanged = () => {
      setColorScheme(mql.matches ? 'dark' : 'light')
    }
    handleSystemColorSchemeChanged()

    mql.addEventListener('change', handleSystemColorSchemeChanged)
    return () => {
      mql.removeEventListener('change', handleSystemColorSchemeChanged)
    }
  }, [props.colorScheme, mql])

  useEffect(() => {
    const c = colorScheme
    const schemeClass = `is${c[0].toUpperCase() + c.substring(1)}`

    document.body.classList.add('colorScheme')
    document.body.classList.add(schemeClass)
    return () => {
      document.body.classList.remove('colorScheme')
      document.body.classList.remove(schemeClass)
    }
  }, [colorScheme])

  // Component
  if (!inited) {
    return (
      <div>Loading</div>
    )
  }

  return (
    <>
      {props.children}
    </>
  )
}
