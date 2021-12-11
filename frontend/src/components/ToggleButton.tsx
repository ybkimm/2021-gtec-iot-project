import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { classNames } from '../internal/utils/className'
import styles from './ToggleButton.module.css'

export interface ToggleButtonProps {
  onChange?: (active: boolean) => boolean | undefined
  value?: boolean
}

const ToggleButton = (props: ToggleButtonProps): ReactElement => {
  const [value, setValue] = useState<boolean>(false)

  const handleClick = () => {
    const isActive = typeof props.value === 'boolean' ? props.value : value
    const result = props.onChange?.call(undefined, !isActive)
    if (result !== false) {
      setValue(!isActive)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={classNames(
        styles.toggleButton,
        (typeof props.value === 'boolean' ? props.value : value)
          && styles.isActive
      )}
    >

    </div>
  )
}
export default ToggleButton
