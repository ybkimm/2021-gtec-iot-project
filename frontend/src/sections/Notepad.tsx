import React, { useState } from 'react'
import PinInput from '../components/PinInput'
import Section from '../components/Section'
import { backendHost } from '../configs'
import useFetch from '../hooks/useFetch'
import { useTranslation } from '../internal/i18n'

const buildNotepadBody = (s: string): string => {
  let body = s.padEnd(32, ' ')
  body = body.substr(0, 16) + ' '
    + body.substr(16, 16)
  return body
}

const Notepad = () => {
  const [t] = useTranslation('notepad')
  const [content, setContent] = useState<string>('')

  const [, isLoading, apiError] = useFetch(
    `${backendHost}/device/notepad`,
    (isFirstTime) => ({
      doInitialRequest: true,
      method: isFirstTime ? 'GET' : 'PUT',
      body: isFirstTime ? undefined : buildNotepadBody(content)
    }),
    [content]
  )

  return (
    <Section title={t('leading')}>
      <PinInput
        cols={16}
        rows={2}
        type="text"
        hasError={apiError != null}
        onSave={setContent}
      />
    </Section>
  )
}
export default Notepad
