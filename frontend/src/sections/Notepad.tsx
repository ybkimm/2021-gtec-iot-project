import React, { useEffect, useState } from 'react'
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

const parseNotepadBody = (s: string): string => {
  return s.substr(0, 16).trimEnd() + s.substr(17, 16).trimEnd()
}

interface NotepadResponse {
  status: boolean
  content: string
}

const Notepad = () => {
  const [t] = useTranslation('notepad')
  const [content, setContent] = useState<string>('')

  const handleInput = (v: string): boolean => {
    return /^[a-zA-Z0-9.*_-]+$/.test(v)
  }

  const [response, isLoading, apiError] = useFetch<NotepadResponse>(
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
      {isLoading
        ? (
          <PinInput
            cols={16}
            rows={2}
            type="text"
          />
        )
        : (
          <PinInput
            cols={16}
            rows={2}
            type="text"
            hasError={apiError != null}
            value={response?.content ? parseNotepadBody(response.content) : ''}
            onInput={handleInput}
            onSave={setContent}
          />
        )}
    </Section>
  )
}
export default Notepad
