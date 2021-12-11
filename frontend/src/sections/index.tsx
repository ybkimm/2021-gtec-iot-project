import { ReactElement } from 'react'
import Jukebox from './Jukebox'
import LightControl from './LightControl'
import Notepad from './Notepad'

export const sectionMap: {
  [key: string]: () => ReactElement
  notepad: typeof Notepad
  jukebox: typeof Jukebox
  light: typeof LightControl
} = {
  notepad: Notepad,
  jukebox: Jukebox,
  light: LightControl
}

export const iconMap: {
  [key: string]: string
  notepad: string
} = {
  notepad: 'pencil',
  jukebox: 'onpu',
  light: 'lightbulb'
}
