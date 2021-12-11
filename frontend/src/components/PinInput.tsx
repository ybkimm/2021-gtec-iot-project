import React, {
  ReactElement,
  MouseEvent,
  KeyboardEvent,
  useRef,
  useState,
  SyntheticEvent, useEffect, ChangeEvent
} from 'react'
import styles from './PinInput.module.css'

export interface PinInputProps {
  cols: number
  rows: number
  type: 'number' | 'password' | 'text'
  autoSaveTimeout?: number
  hasError?: boolean
  value?: string

  inputFilter?: (v: string) => boolean | void
  onChange?: (v: string) => void
}

const PinInput = (props: PinInputProps): ReactElement => {
  const [value, setValue] = useState<string>('')

  // Handle props.value
  useEffect(() => {
    if (typeof props.value !== 'string') {
      return
    }
    if (props.value !== value) {
      setValue(props.value)
    }
  }, [props.value])

  // Rollback the value when onInput rejects.
  const oldValue = useRef<string>(value)
  useEffect(() => {
    if (value === oldValue.current) {
      return
    }

    const filterResult = props.inputFilter?.call(undefined, value)
    if (filterResult === false) {
      setValue(oldValue.current)
      return
    }

    oldValue.current = value
    props.onChange?.call(undefined, value)
  }, [value])

  const textInput = useRef<HTMLInputElement>(null)

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
          return ''.padEnd(props.cols, '\t')
        }

        if (len >= props.cols * (props.rows - 1)) {
          return prev
        }

        const i = Math.ceil(len / props.cols) * props.cols
        return prev.padEnd(i, '\t')
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(
      e.currentTarget.value.substr(0, props.cols * props.rows)
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
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
        value={value}
      />
    </div>
  )
}
export default PinInput
