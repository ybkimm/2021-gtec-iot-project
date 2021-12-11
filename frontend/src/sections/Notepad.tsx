import React, { useEffect, useRef, useState } from 'react'
import PinInput from '../components/PinInput'
import Section from '../components/Section'
import { backendHost } from '../configs'
import useFetch from '../hooks/useFetch'
import useTrigger from '../hooks/useTrigger'
import { useTranslation } from '../internal/i18n'
import { classNames } from '../internal/utils/className'
import styles from './Notepad.module.css'

const buildNotepadBody = (s: string): string => {
  let body = s.padEnd(32, ' ')
  body = body.substr(0, 16) + ' '
    + body.substr(16, 16)
  return body
}

const parseNotepadBody = (s: string): string => {
  return s.substr(0, 16).trimEnd() + s.substr(17, 16).trimEnd()
}

interface NotepadResponse {
  status: boolean
  content: string
  timestamp: number
}

interface SaveResponse {
  timestamp: number
}

const Notepad = () => {
  const [t] = useTranslation('notepad')
  const [content, setContent] = useState<string>('')

  // Initial loading
  const [response, isLoading] = useFetch<NotepadResponse>(
    `${backendHost}/device/notepad`,
    {
      doInitialRequest: true,
      method: 'GET'
    },
    []
  )
  useEffect(() => {
    if (response == null) {
      return
    }
    setContent(parseNotepadBody(response.content))
  }, [response?.timestamp])

  // Saving
  const [saveCount, triggerSave] = useTrigger()
  const [, isSaving] = useFetch<SaveResponse>(
    `${backendHost}/device/notepad`,
    {
      doInitialRequest: false,
      method: 'PUT',
      body: buildNotepadBody(content)
    },
    [saveCount]
  )

  const saveTimeoutID = useRef<any>(null)
  const doSave = () => {
    if (saveTimeoutID.current != null) {
      clearTimeout(saveTimeoutID.current)
    }
    saveTimeoutID.current = setTimeout(() => {
      triggerSave()
    }, 2000)
  }

  return (
    <Section title={t('leading')}>
      <div className={styles.wrapper}>
        <PinInput
          cols={16}
          rows={2}
          type="text"
          inputFilter={(v) => {
            // Disable editing while loading
            if (isLoading || isSaving) {
              return false
            }
            return /^[\x20-\x7E\t]*$/.test(v)
          }}
          onChange={(v) => {
            if (v === content) {
              return
            }
            setContent(v)
            doSave()
          }}
          value={content}
        />

        <div
          className={classNames(
            styles.loadingIndicator,
            (isLoading || isSaving) && styles.isActive
          )}
        />
      </div>
    </Section>
  )
}
export default Notepad
