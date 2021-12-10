import { ReactNode } from 'react'
import Notepad from './Notepad'

export const sectionMap: {
  [key: string]: () => ReactNode
  notepad: typeof Notepad
} = {
  notepad: Notepad
}

export const iconMap: {
  [key: string]: string
  notepad: string
} = {
  notepad: 'pencil'
}
