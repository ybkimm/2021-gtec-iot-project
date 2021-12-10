import React, { ReactNode } from 'react'
import styles from './Button.module.css'

export interface ButtonProps {
  children: ReactNode
}

const Button = (props: ButtonProps) => {
  return (
    <div className={styles.button}>{props.children}</div>
  )
}
export default Button
