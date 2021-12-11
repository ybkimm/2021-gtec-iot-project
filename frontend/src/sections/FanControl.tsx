import React, { ReactElement, useEffect } from 'react'
import NoSectionPadding from '../components/NoSectionPadding'
import Section from '../components/Section'
import ToggleButton from '../components/ToggleButton'
import { backendHost } from '../configs'
import useFetch from '../hooks/useFetch'
import useTrigger from '../hooks/useTrigger'
import { useTranslation } from '../internal/i18n'
import styles from './FanControl.module.css'

interface FanStatus {
  status: string
  active: boolean
}

const FanControl = (): ReactElement => {
  const [t] = useTranslation('fan')

  const [fanStatusCount, triggerGetFanStatus] = useTrigger()
  const [fanStatus] = useFetch<FanStatus>(
    `${backendHost}/device/fan`,
    {
      method: 'GET',
      doInitialRequest: true
    },
    [fanStatusCount]
  )
  useEffect(() => {
    const id = setInterval(triggerGetFanStatus, 2000)
    return () => clearInterval(id)
  }, [])

  const controlFanAbortController = new AbortController()
  const controlFan = (isActive: boolean) => {
    fetch(
      `${backendHost}/device/fan?action=${isActive ? 'on' : 'off'}`,
      {
        method: 'POST',
        mode: 'cors',
        signal: controlFanAbortController.signal
      }
    )
      .then(() => {
        triggerGetFanStatus()
      })
      .catch((err) => {
        console.error('control light failed', err)
      })
  }
  useEffect(() => () => controlFanAbortController.abort(), [])

  return (
    <Section title={t('leading')}>
      <NoSectionPadding>
        <div className={styles.fanControl}>
          <p>{t('toggle-fan')}</p>
          <div className="control">
            <ToggleButton
              value={fanStatus != null && fanStatus.active}
              onChange={(active) => controlFan(active)}
            />
          </div>
        </div>
      </NoSectionPadding>
    </Section>
  )
}
export default FanControl
