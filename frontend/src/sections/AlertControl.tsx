import React, { ReactElement, useEffect } from 'react'
import NoSectionPadding from '../components/NoSectionPadding'
import Section from '../components/Section'
import ToggleButton from '../components/ToggleButton'
import { backendHost } from '../configs'
import useFetch from '../hooks/useFetch'
import useTrigger from '../hooks/useTrigger'
import { useTranslation } from '../internal/i18n'
import styles from './AlertControl.module.css'

interface AlertStatus {
  status: string
  active: boolean
}

const AlertControl = (): ReactElement => {
  const [t] = useTranslation('alert')

  const [alertStatusCount, triggerGetAlertStatus] = useTrigger()
  const [alertStatus] = useFetch<AlertStatus>(
    `${backendHost}/device/alert`,
    {
      method: 'GET',
      doInitialRequest: true
    },
    [alertStatusCount]
  )
  useEffect(() => {
    const id = setInterval(triggerGetAlertStatus, 2000)
    return () => clearInterval(id)
  }, [])

  const controlAlertAbortController = new AbortController()
  const controlAlert = (isActive: boolean) => {
    fetch(
      `${backendHost}/device/alert?action=${isActive ? 'on' : 'off'}`,
      {
        method: 'POST',
        mode: 'cors',
        signal: controlAlertAbortController.signal
      }
    )
      .then(() => {
        triggerGetAlertStatus()
      })
      .catch((err) => {
        console.error('control light failed', err)
      })
  }
  useEffect(() => () => controlAlertAbortController.abort(), [])

  return (
    <Section title={t('leading')}>
      <NoSectionPadding>
        <div className={styles.alertControl}>
          <p>{t('toggle-alert')}</p>
          <div className="control">
            <ToggleButton
              value={alertStatus != null && alertStatus.active}
              onChange={(active) => controlAlert(active)}
            />
          </div>
        </div>
      </NoSectionPadding>
    </Section>
  )
}
export default AlertControl
