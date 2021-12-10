import React, { ReactNode } from 'react'
import styles from './Section.module.css'

export interface SectionProps {
  children: ReactNode
  title?: string
}

const Section = (props: SectionProps) => {
  return (
    <section className={styles.section}>
      {props.title != null && (
        <h1 className={styles.leading}>{props.title}</h1>
      )}
      {props.children}
    </section>
  )
}
export default Section
