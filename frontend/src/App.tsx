import React, { ReactElement, useReducer } from 'react'
import styles from './App.module.css'
import AppWrapper from './AppWrapper'
import './assets/global.css'
import Button from './components/Button'
import Container from './components/Container'
import { backendHost } from './configs'
import useFetch from './hooks/useFetch'
import useHashScroll from './hooks/useHashScroll'
import { DeviceInfo } from './internal/types'
import { classNames } from './internal/utils/className'
import { defaultDeviceStatus, deviceStatusReducer } from './reducers/deviceStatus'
import Notepad from './sections/Notepad'
import Sidebar from './sections/Sidebar'

const dummyDevice = { class: 'dummy', name: 'Loading', features: [] }

export default function App (): ReactElement {
  const [scrollManager, currentHash] = useHashScroll()
  const [deviceStatus, dispatchDeivceStatus] = useReducer(
    deviceStatusReducer,
    defaultDeviceStatus
  )
  const [deviceInfo, isLoading, deviceInfoError] = useFetch<DeviceInfo>(
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
            {deviceInfo?.features.map((feature) => (
              <div key={feature} ref={scrollManager.ref(`feature_${feature}`)}>
                {feature === 'notepad' && <Notepad />}
              </div>
            ))}

            <div className={styles.section} ref={scrollManager.ref('notepad')}>
              <h1 className={styles.leading}>메모장</h1>

              <textarea className={styles.memo}></textarea>
            </div>

            <div className={styles.section} ref={scrollManager.ref('dashboard')}>
              <h1 className={styles.leading}>대시보드</h1>

              <div className={styles.status}>
                <div className={
                  classNames(
                    styles.statusItem,
                    deviceStatus.light ? styles.isEnabled : null
                  )
                }>
                    전등
                </div>

                <div className={
                  classNames(
                    styles.statusItem,
                    deviceStatus.fan ? styles.isEnabled : null
                  )
                }>
                    환풍기
                </div>

                <div className={
                  classNames(
                    styles.statusItem,
                    deviceStatus.fan ? styles.isEnabled : null
                  )
                }>
                    부저
                </div>
              </div>
            </div>

            <div className={styles.section} ref={scrollManager.ref('control')}>
              <h1 className={styles.leading}>기기 수동 컨트롤</h1>

              <h2>전등</h2>
              <Button>켜기</Button>
              <Button>끄기</Button>

              <h2>FAN</h2>
              <Button>켜기</Button>
              <Button>끄기</Button>

              <h2>비상 경고</h2>
              <Button>시작</Button>
              <Button>정지</Button>
            </div>
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
