import React, {
  ReactElement, ReactNode,
  useEffect,
  useState
} from 'react'
import smoothscroll from 'smoothscroll-polyfill'
import init from './internal/init'

interface AppProps {
  children?: ReactNode
}

export default function AppWrapper (props: AppProps): ReactElement {
  // Init
  const [inited, setInitState] = useState(false)

  useEffect(() => {
    init()
      .then(() => setInitState(true))
      .catch((e) => console.error(e))
    smoothscroll.polyfill()
  }, [])

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
