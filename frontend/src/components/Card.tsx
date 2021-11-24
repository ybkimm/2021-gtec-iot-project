import React, { ReactElement, ReactNode } from 'react'
import styles from './Card.module.css'

export interface CardProps {
  children?: ReactNode
}

const Card = (props: CardProps): ReactElement => {
  return (
    <div className={styles.card}>
      {props.children}
    </div>
  )
}
export default Card
