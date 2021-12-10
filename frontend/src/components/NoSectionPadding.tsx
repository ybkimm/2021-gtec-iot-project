import React, { ReactElement, ReactNode } from 'react'
import styles from './Section.module.css'

export interface NoSectionPaddingProps {
  children: ReactNode
}

const NoSectionPadding = (props: NoSectionPaddingProps): ReactElement => {
  return (
    <div className={styles.noSectionPadding}>
      {props.children}
    </div>
  )
}
export default NoSectionPadding
