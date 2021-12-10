import { ReactElement } from 'react'
import Jukebox from './Jukebox'
import Notepad from './Notepad'

export const sectionMap: {
  [key: string]: () => ReactElement
  notepad: typeof Notepad
  jukebox: typeof Jukebox
} = {
  notepad: Notepad,
  jukebox: Jukebox
}

export const iconMap: {
  [key: string]: string
  notepad: string
} = {
  notepad: 'pencil',
  jukebox: 'onpu'
}
