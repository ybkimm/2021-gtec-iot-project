import React from 'react'
import SidebarItem from '../components/SidebarItem'
import { HashScrollManager } from '../hooks/useHashScroll'
import { useTranslation } from '../internal/i18n'
import { DeviceInfo } from '../internal/types'
import styles from './Sidebar.module.css'
import { iconMap, sectionMap } from './index'

export interface SidebarProps {
  deviceInfo: DeviceInfo
  scrollManager: HashScrollManager
  currentHash: string
}

const Sidebar = (props: SidebarProps) => {
  const [t] = useTranslation('sections')
  return (
    <div className={styles.sidebar}>
      <div className={styles.stickySidebar}>
        {props.deviceInfo.features.map((feature) => feature in sectionMap && (
          <SidebarItem
            key={feature}
            icon={feature in iconMap ? iconMap[feature] : 'circle'}
            isActive={props.currentHash === `feature_${feature}`}
            onClick={props.scrollManager.linkHandler(`feature_${feature}`)}
          >
            {t(feature)}
          </SidebarItem>
        ))}
      </div>
    </div>
  )
}
export default Sidebar
