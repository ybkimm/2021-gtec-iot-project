import React, { ReactElement } from 'react'
import styles from './App.module.css'
import AppWrapper from './AppWrapper'
import './assets/global.css'
import Container from './components/Container'
import { backendHost } from './configs'
import useFetch from './hooks/useFetch'
import useHashScroll from './hooks/useHashScroll'
import { DeviceInfo } from './internal/types'
import { sectionMap } from './sections'
import Sidebar from './sections/Sidebar'

const dummyDevice = { class: 'dummy', name: 'Loading', features: [] }

export default function App (): ReactElement {
  const [scrollManager, currentHash] = useHashScroll()
  const [deviceInfo, isLoading] = useFetch<DeviceInfo>(
    `${backendHost}/device`,
    () => ({
      method: 'GET'
    }),
    []
  )

  return (
    <AppWrapper>
      <header className={styles.header}>
        <Container>
          <div className={styles.headerInner}>
            <a className={styles.branding}>SmartControl</a>
          </div>
        </Container>
      </header>

      <Container>
        <div className={styles.contents}>
          <Sidebar
            deviceInfo={isLoading || deviceInfo == null ? dummyDevice : deviceInfo}
            scrollManager={scrollManager}
            currentHash={currentHash}
          />

          <div className={styles.main}>
            {deviceInfo?.features.map((feature) => {
              const Section = feature in sectionMap
                ? sectionMap[feature]
                : (): ReactElement => <></>
              return (
                <div key={feature} ref={scrollManager.ref(`feature_${feature}`)}>
                  <Section />
                </div>
              )
            })}
          </div>
        </div>
      </Container>

      <footer className={styles.footer}>
        <div className={['container', styles.container].join(' ')}>
          <p>&copy; 2021 SmartControl Team</p>
        </div>
      </footer>
    </AppWrapper>
  )
}
