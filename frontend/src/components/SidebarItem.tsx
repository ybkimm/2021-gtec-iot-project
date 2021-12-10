import React, { MouseEvent, ReactNode } from 'react'
import { classNames } from '../internal/utils/className'
import styles from './SidebarItem.module.css'

export interface SidebarItemProps {
  icon: string
  isActive: boolean
  children: ReactNode
  onClick: (e: MouseEvent<HTMLElement>) => void
}

const SidebarItem = (props: SidebarItemProps) => {
  return (
    <div
      className={classNames(
        styles.sidebarItem,
        props.isActive && styles.isActive
      )}
      onClick={props.onClick}
    >
      <span className={classNames(styles.icon, 'iconfont', props.icon)} />
      {props.children}
    </div>
  )
}
export default SidebarItem
