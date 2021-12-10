import React, { ReactElement, ReactNode } from 'react'
import styles from './Container.module.css'

export interface ContainerProps {
  className?: string
  children?: ReactNode
}

const Container = (props: ContainerProps): ReactElement => {
  const className = [styles.container, props.className].filter(v => v != null).join(' ')
  return (
    <div className={className}>
      {props.children}
    </div>
  )
}
export default Container
