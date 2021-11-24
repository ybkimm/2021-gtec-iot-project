import React, { ReactElement } from 'react'
import AppWrapper from './AppWrapper'
import Pages from './pages'

import './assets/global.css'

export default function App (): ReactElement {
  return (
    <AppWrapper>
      <div>
        <Pages />
      </div>
    </AppWrapper>
  )
}
