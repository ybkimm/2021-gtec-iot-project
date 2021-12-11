import React, { useEffect, useRef, useState } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'
import NoSectionPadding from '../components/NoSectionPadding'
import Section from '../components/Section'
import ToggleButton from '../components/ToggleButton'
import { backendHost } from '../configs'
import useFetch from '../hooks/useFetch'
import useTrigger from '../hooks/useTrigger'
import { useTranslation } from '../internal/i18n'
import { classNames } from '../internal/utils/className'
import styles from './LightControl.module.css'

interface LightInfo {
  name: string
  position: [number, number]
}

interface LightStatus {
  status: string
  lights: boolean[]
}

const LightControl = () => {
  const [t] = useTranslation('light')

  const [lightInfo, lightInfoLoading] = useFetch<LightInfo[]>(
    `${backendHost}/device/light/info`,
    {
      method: 'GET',
      doInitialRequest: true
    },
    []
  )

  const [lightStatusCount, triggerLightStatus] = useTrigger()
  const [lightStatus] = useFetch<LightStatus>(
    `${backendHost}/device/light`,
    {
      method: 'GET',
      doInitialRequest: true
    },
    [lightStatusCount]
  )
  useEffect(() => {
    const id = setInterval(triggerLightStatus, 2000)
    return () => clearInterval(id)
  }, [])

  const controlLightAbortController = new AbortController()
  const controlLight = (i: number, isActive: boolean) => {
    fetch(
      `${backendHost}/device/light?index=${i}&action=${isActive ? 'on' : 'off'}`,
      {
        method: 'POST',
        mode: 'cors',
        signal: controlLightAbortController.signal
      }
    )
      .then(() => {
        triggerLightStatus()
      })
      .catch((err) => {
        console.error('control light failed', err)
      })
  }
  useEffect(() => () => controlLightAbortController.abort(), [])

  return (
    <Section title={t('leading')}>
      {lightInfoLoading
        ? (
          <>
            <p>Loading...</p>
          </>
        )
        : (
          <>
            <NoSectionPadding>
              <div className={styles.lightMap}>
                <img src={`${backendHost}/device/light/background`} alt=""/>
                {lightInfo?.map((light, i) => (
                  <div
                    key={i}
                    className={classNames(
                      styles.lightPoint,
                      lightStatus?.lights[i] === true && styles.isActive
                    )}
                    style={{
                      left: `${light.position[0] / 1920 * 100}%`,
                      top: `${light.position[1] / 1080 * 100}%`
                    }}
                  />
                ))}
              </div>
              <div className={styles.lightControls}>
                {lightInfo?.map((lightInfo, i) => (
                  <div key={i} className={styles.lightItem}>
                    <p>{lightInfo.name}</p>
                    <div className="control">
                      <ToggleButton
                        onChange={(active) => controlLight(i, active)}
                        value={
                          lightStatus != null && lightStatus.lights.length > i
                          && lightStatus.lights[i]
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </NoSectionPadding>
          </>
        )}
    </Section>
  )
}
export default LightControl
