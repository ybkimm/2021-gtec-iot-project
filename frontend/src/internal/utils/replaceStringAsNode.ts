import { ReactNode, ReactNodeArray } from 'react'

const replaceStringAsNode = (
  s: string,
  orig: string,
  node: ReactNode
): ReactNodeArray => {
  return s
    .split(orig)
    .reduce<ReactNodeArray>((acc, cur, i) => {
      if (!i) {
        return [cur]
      }
      return [...acc, (
        node
      ), cur]
    }, [])
}
export default replaceStringAsNode
