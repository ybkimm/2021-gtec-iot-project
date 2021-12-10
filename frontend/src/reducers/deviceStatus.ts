export interface LightStatus {
  isOn: boolean
}

export interface ActionSetLight {
  type: 'SET_LIGHT',
  isOn: boolean
}

export interface FanStatus {
  isOn: boolean
}

export interface ActionSetFan {
  type: 'SET_FAN',
  isOn: boolean
}

export interface AlertStatus {
  isOn: boolean
}

export interface ActionSetAlert {
  type: 'SET_ALERT'
  isOn: boolean
}

export interface NotepadStatus {
  content: string
}

export interface ActionSetNotepad {
  type: 'SET_NOTEPAD'
  content: string
}

export interface Music {
  title: string
  artist: string
  file: string
  duration: number
}

export interface JukeboxStatus {
  playlist: Music[]
  currentPlaying?: Music
  isPlaying: boolean
  currentTime: number
}

export interface ActionUpdateJukeboxPlaylist {
  type: 'UPDATE_JUKEBOX_PLAYLIST'
  playlist: Music[]
}

export interface ActionControlJukeboxStop {
  type: 'CONTROL_JUKEBOX_STOP'
}

export interface ActionControlJukeboxPlay {
  type: 'CONTROL_JUKEBOX_PLAY'
  music: Music
}

export interface ActionControlJukeboxSeekTo {
  type: 'CONTROL_JUKEBOX_SEEK_TO'
  timestamp: number
}

export interface DeviceStatus {
  host: string
  light: LightStatus
  fan: FanStatus
  alert: AlertStatus
  notepad: NotepadStatus
  jukebox: JukeboxStatus
}

export interface ActionInit {
  type: 'INIT'
  status: DeviceStatus
}

export type DeviceActions =
  ActionSetLight | ActionSetFan | ActionSetAlert | ActionSetNotepad |
  ActionUpdateJukeboxPlaylist | ActionControlJukeboxStop |
  ActionControlJukeboxPlay | ActionControlJukeboxSeekTo | ActionInit

export const defaultDeviceStatus: DeviceStatus = {
  host: 'localhost:7301',
  light: { isOn: false },
  fan: { isOn: false },
  alert: { isOn: false },
  notepad: { content: '' },
  jukebox: {
    playlist: [],
    currentPlaying: undefined,
    isPlaying: false,
    currentTime: 0
  }
}

export const deviceStatusReducer = (
  prevStatus: DeviceStatus,
  action: DeviceActions
): DeviceStatus => {
  switch (action.type) {
  case 'INIT':
    return action.status
  case 'SET_LIGHT':
    return {
      ...prevStatus,
      light: {
        isOn: action.isOn
      }
    }

  case 'SET_ALERT':
    return {
      ...prevStatus,
      alert: {
        isOn: action.isOn
      }
    }

  case 'SET_FAN':
    return {
      ...prevStatus,
      fan: {
        isOn: action.isOn
      }
    }

  case 'SET_NOTEPAD':
    return {
      ...prevStatus,
      notepad: {
        content: action.content
      }
    }

  case 'UPDATE_JUKEBOX_PLAYLIST':
    return {
      ...prevStatus,
      jukebox: {
        ...prevStatus.jukebox,
        playlist: action.playlist,
        currentPlaying: undefined
      }
    }

  case 'CONTROL_JUKEBOX_PLAY':
    return {
      ...prevStatus,
      jukebox: {
        ...prevStatus.jukebox,
        currentPlaying: action.music,
        isPlaying: true,
        currentTime: 0
      }
    }

  case 'CONTROL_JUKEBOX_STOP':
    return {
      ...prevStatus,
      jukebox: {
        ...prevStatus.jukebox,
        currentPlaying: undefined,
        isPlaying: false,
        currentTime: 0
      }
    }

  case 'CONTROL_JUKEBOX_SEEK_TO':
    return {
      ...prevStatus,
      jukebox: {
        ...prevStatus.jukebox,
        currentTime: action.timestamp
      }
    }

  default:
    throw new Error('deviceStatus: unreachable code')
  }
}
