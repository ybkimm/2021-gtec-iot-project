import { useState } from 'react'

const useTrigger = (): [number, () => void] => {
  const [state, setState] = useState(0)
  return [state, () => setState((prev) => prev + 1)]
}
export default useTrigger
