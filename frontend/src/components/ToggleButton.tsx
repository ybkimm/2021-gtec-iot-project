import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { classNames } from '../internal/utils/className'
import styles from './ToggleButton.module.css'

export interface ToggleButtonProps {
  onChange?: (active: boolean) => void
  value?: boolean
}

const ToggleButton = (props: ToggleButtonProps): ReactElement => {
  const [isActive, setActive] = useState<boolean>(false)

  const isFirstTime = useRef<boolean>(false)
  useEffect(() => {
    if (!isFirstTime.current) {
      isFirstTime.current = true
      return
    }
    props.onChange?.call(undefined, isActive)
  }, [isActive])

  return (
    <div
      onClick={() => setActive(!isActive)}
      className={classNames(
        styles.toggleButton,
        (typeof props.value === 'boolean' ? props.value : isActive)
          && styles.isActive
      )}
    >

    </div>
  )
}
export default ToggleButton
