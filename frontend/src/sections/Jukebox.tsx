import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import dummyart from '../assets/dummyart.png'
import NoSectionPadding from '../components/NoSectionPadding'
import Section from '../components/Section'
import { backendHost } from '../configs'
import useFetch from '../hooks/useFetch'
import useTrigger from '../hooks/useTrigger'
import { useTranslation } from '../internal/i18n'
import { classNames } from '../internal/utils/className'
import styles from './Jukebox.module.css'

interface JukeboxStatusResponse {
  playlist: Music[]
}

interface JukeboxCurrentPlayingResponse extends Music {
  // eslint-disable-next-line camelcase
  is_playing: boolean
  index: number
}

interface Music {
  title: string
  artist: string
  album: string
  albumart: string
  duration: string
}

const Jukebox = (): ReactElement => {
  const [t] = useTranslation('jukebox')

  const [jukeboxStatus] = useFetch<JukeboxStatusResponse>(
    `${backendHost}/device/jukebox`,
    {
      doInitialRequest: true,
      method: 'GET'
    },
    []
  )

  const [isPlaying, setPlaying] = useState<boolean>(false)
  const [playIndex, setPlayIndex] = useState<number>(0)

  // Play / Stop API
  const [playCount, triggerPlay] = useTrigger()
  const [playResult] = useFetch(
    `${backendHost}/device/jukebox/play?index=${playIndex}`,
    {
      doInitialRequest: false,
      method: 'POST'
    },
    [playCount]
  )

  const [stopCount, triggerStop] = useTrigger()
  useFetch(
    `${backendHost}/device/jukebox/stop`,
    {
      doInitialRequest: false,
      method: 'POST'
    },
    [stopCount]
  )

  // Current music
  const [updateCount, triggerUpdate] = useTrigger()
  const [currentMusic] = useFetch<JukeboxCurrentPlayingResponse>(
    `${backendHost}/device/jukebox/current_music`,
    {
      doInitialRequest: true,
      method: 'GET'
    },
    [playResult, updateCount]
  )

  useEffect(() => {
    const id = setInterval(() => {
      triggerUpdate()
    }, 1000)

    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (currentMusic == null) {
      return
    }
    setPlayIndex(currentMusic.index)
    if (currentMusic.is_playing) {
      setPlaying(true)
    } else {
      setPlaying(false)
    }
  }, [currentMusic])

  const playNext = useMemo<() => void>(() => {
    if (jukeboxStatus == null) {
      return () => setPlayIndex(0)
    }
    return () => {
      if (currentMusic == null) {
        return
      }
      if (currentMusic.index + 1 === jukeboxStatus.playlist.length) {
        setPlayIndex(0)
      } else {
        setPlayIndex(currentMusic.index + 1)
      }
      triggerPlay()
    }
  }, [currentMusic, jukeboxStatus])

  const playPrev = useMemo<() => void>(() => {
    if (jukeboxStatus == null) {
      return () => setPlayIndex(0)
    }
    return () => {
      if (currentMusic == null) {
        return
      }
      if (currentMusic.index === 0) {
        setPlayIndex(jukeboxStatus.playlist.length - 1)
      } else {
        setPlayIndex(currentMusic.index - 1)
      }
      setPlayIndex((prev) => {
        if (prev === 0) {
          return jukeboxStatus.playlist.length - 1
        }
        return prev - 1
      })
      triggerPlay()
    }
  }, [currentMusic, jukeboxStatus])

  return (
    <Section title={t('leading')}>
      <NoSectionPadding>
        <div className={styles.currentSong}>
          {currentMusic == null
            ? (
              <>
                <figure className={styles.albumart}>
                  <div className={styles.albumartInner}>
                    <img src={dummyart} alt=""/>
                  </div>
                </figure>
                <div className={styles.meta}>
                  <p className={styles.currentPlaying}>{t('current-playing')}:</p>
                  <h1 className={styles.title}>
                    {t('current-music-loading-title')}
                  </h1>
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                </div>
              </>
            )
            : (
              <>
                <figure className={styles.albumart}>
                  <div className={styles.albumartInner}>
                    <img src={`${backendHost}/device/jukebox/cover?index=${currentMusic.index}`} alt=""/>
                  </div>
                </figure>
                <div className={styles.meta}>
                  <p className={styles.currentPlaying}>{t('current-playing')}:</p>
                  <h1 className={styles.title}>
                    {currentMusic.title}
                  </h1>
                  <p>{currentMusic.album}</p>
                  <p>{currentMusic.artist}</p>
                </div>
              </>
            )}
        </div>
      </NoSectionPadding>

      <div className={styles.control}>
        <div
          className={classNames(styles.button, styles.prev)}
          onClick={playPrev}
        >
          <span className={classNames(styles.icon, 'iconfont', 'musicPrev')} />
        </div>

        {isPlaying
          ? (
            <div
              className={classNames(styles.button, styles.stop)}
              onClick={triggerStop}
            >
              <span className={classNames(styles.icon, 'iconfont', 'stop')} />
            </div>
          )
          : (
            <div
              className={classNames(styles.button, styles.play)}
              onClick={triggerPlay}
            >
              <span className={classNames(styles.icon, 'iconfont', 'play')} />
            </div>
          )}

        <div
          className={classNames(styles.button, styles.next)}
          onClick={playNext}
        >
          <span className={classNames(styles.icon, 'iconfont', 'musicNext')} />
        </div>
      </div>

      <NoSectionPadding>
        <div className={styles.playlist}>
          {jukeboxStatus?.playlist.map((item, i) => (
            <div
              key={i}
              className={styles.playlistItem}
              onClick={() => {
                setPlayIndex(i)
                triggerPlay()
              }}
            >
              <div className={styles.index}>
                {i === playIndex
                  ? (
                    <span className={classNames(styles.icon, 'iconfont', 'play')} />
                  )
                  : i + 1
                }
              </div>

              <div className={styles.albumart}>
                <img src={`${backendHost}/device/jukebox/cover?index=${i}`} alt=""/>
              </div>

              <div className={styles.meta}>
                <p>{item.title}</p>
                <p className={styles.artist}>{item.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </NoSectionPadding>
    </Section>
  )
}
export default Jukebox
