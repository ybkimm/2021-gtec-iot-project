import {
  useEffect,
  MouseEvent,
  useState,
  createRef,
  RefObject,
  useMemo, Dispatch
} from 'react'

export class HashScrollManager {
  readonly #hashOffsets: Array<{key: string, offset: number}>
  readonly #refMap: {[key: string]: RefObject<HTMLElement>}
  readonly #dispatchHash: Dispatch<string>

  constructor (dispatchHash: Dispatch<string>) {
    this.#hashOffsets = []
    this.#refMap = {}
    this.#dispatchHash = dispatchHash

    this.ref = this.ref.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.linkHandler = this.linkHandler.bind(this)
  }

  public ref<T extends HTMLElement> (id: string): RefObject<T> {
    if (id in this.#refMap) {
      return this.#refMap[id] as RefObject<T>
    }

    const ref = createRef<T>()
    this.#refMap[id] = ref

    this.#hashOffsets.push({
      key: id,
      get offset () {
        return ref.current?.offsetTop || Number.MAX_VALUE
      }
    })

    return ref
  }

  public handleScroll () {
    let i = this.#hashOffsets.length - 1
    const scrollY = window.scrollY
    if (scrollY <= 0) {
      this.clearHash()
      return
    }
    for (; i >= 0; i--) {
      if (scrollY < this.#hashOffsets[i].offset) {
        continue
      }
      const hash = this.#hashOffsets[i].key
      location.hash = hash
      this.#dispatchHash(hash)
      return
    }
    this.clearHash()
  }

  public linkHandler (id: string) {
    return (e: MouseEvent<HTMLElement>) => {
      e.preventDefault()
      this.#refMap[id].current?.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }

  public clearHash () {
    if (location.hash !== '') {
      this.#dispatchHash('')
      history.pushState('', document.title, window.location.pathname)
    }
  }
}

const useHashScroll = (): [HashScrollManager, string] => {
  const [currentHash, dispatchCurrentHash] = useState('')
  const manager = useMemo(
    () => new HashScrollManager(dispatchCurrentHash),
    [dispatchCurrentHash]
  )

  useEffect(() => {
    manager.handleScroll()
    window.addEventListener('scroll', manager.handleScroll)
    return () => {
      window.removeEventListener('scroll', manager.handleScroll)
    }
  }, [manager, dispatchCurrentHash])

  return [manager, currentHash]
}
export default useHashScroll
