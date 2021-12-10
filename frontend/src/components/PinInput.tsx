import React, {
  FormEvent,
  ReactElement,
  MouseEvent,
  KeyboardEvent,
  useRef,
  useState,
  SyntheticEvent, useEffect
} from 'react'
import styles from './PinInput.module.css'

const defaultAutoSaveTimeout = 500 // ms

export interface PinInputProps {
  cols: number
  rows: number
  type: 'number' | 'password' | 'text'
  autoSaveTimeout?: number
  hasError?: boolean
  value?: string

  onInput?: (v: string) => boolean | void
  onSave?: (v: string) => void
}

const PinInput = (props: PinInputProps): ReactElement => {
  const textInput = useRef<HTMLInputElement>(null)
  const saveTimer = useRef<never>(undefined as never)

  const [value, setValue] = useState<string[]>([])
  useEffect(() => {
    console.log('value update', props.value)
    if (props.value != null) {
      setValue(props.value.split(''))
    }
  }, [props.value])

  // Auto save
  useEffect(() => {
    saveTimer.current = setTimeout(() => {
      props.onSave?.call(undefined, value.join(''))
    }, props.autoSaveTimeout || defaultAutoSaveTimeout) as never

    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current)
      }
    }
  }, [saveTimer, value])

  const handleClick = (e: MouseEvent<unknown>) => {
    e.preventDefault()
    textInput.current?.focus()
  }

  const handleBackspace = () => {
    let i = value.length - 1

    if (value[i] === '\t') {
      for (i--; i > 0; i--) {
        if (value[i] !== '\t') {
          i++
          break
        }
      }
    }

    setValue((prev) => prev.slice(0, i))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.code) {
    case 'Enter':
      e.preventDefault()
      setValue((prev) => {
        const len = prev.length

        if (len === 0) {
          return new Array(props.cols).fill('\t')
        }

        if (len > props.cols * (props.rows - 1)) {
          return prev
        }

        const result = [...prev]
        let i = Math.ceil(len / props.cols) * props.cols - len
        for (; i > 0; i--) {
          result.push('\t')
        }

        return result
      })
      break

    case 'Backspace':
      e.preventDefault()
      handleBackspace()
      break
    }
  }

  const handleSelect = (e: SyntheticEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.currentTarget.selectionStart = e.currentTarget.selectionEnd = value.length
  }

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    if (props.onInput?.call(undefined, e.currentTarget.value) === false) {
      return
    }

    setValue(
      e.currentTarget.value.substr(0, props.cols * props.rows)
        .split('')
    )
  }

  return (
    <div className={[styles.pinInput, props.hasError && styles.hasError].filter(v => v != null).join(' ')} onClick={handleClick}>
      <div className={styles.pins}>
        {new Array(props.rows).fill(0).map((_, y) => (
          <div key={`row${y}`} className={styles.row}>
            {new Array(props.cols).fill(0).map((_, x) => {
              const n = y * props.cols + x
              const v = value.length > n ? value[n] : null
              const isSelected = n === value.length
              const isEmpty = v == null

              return (
                <div
                  key={`col${x}`}
                  className={[
                    styles.col,
                    isSelected && styles.isSelected,
                    isEmpty && styles.isEmpty
                  ].filter(v => v != null).join(' ')}
                >
                  {value[y * props.cols + x] || ''}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <input
        type="text"
        className={styles.input}
        ref={textInput}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
        value={value.join('')}
      />
    </div>
  )
}
export default PinInput
