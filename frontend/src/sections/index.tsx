import { ReactElement } from 'react'
import AlertControl from './AlertControl'
import FanControl from './FanControl'
import Jukebox from './Jukebox'
import LightControl from './LightControl'
import Notepad from './Notepad'

export const sectionMap: {
  [key: string]: () => ReactElement
  notepad: typeof Notepad
  jukebox: typeof Jukebox
  light: typeof LightControl
  alert: typeof AlertControl
  fan: typeof FanControl
} = {
  notepad: Notepad,
  jukebox: Jukebox,
  light: LightControl,
  alert: AlertControl,
  fan: FanControl
}

export const iconMap: {
  [key: string]: string
  notepad: string
  jukebox: string
  light: string
  alert: string
  fan: string
} = {
  notepad: 'pencil',
  jukebox: 'onpu',
  light: 'lightbulb',
  alert: 'alert',
  fan: 'ice'
}
