import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from '../lib/i18n'
import replaceStringAsNode from '../lib/utils/replaceStringAsNode'
import styles from './Header.module.css'

export interface HeaderProps {
  /**
   * 서비스 브랜딩을 하기 위한 요소입니다.
   */
  branding: ReactNode

  /**
   * 네비게이션을 위한 요소입니다.
   */
  nav?: ReactNode

  /**
   * 로그인 되어 있으면 이 값을 입력하여 우측에 표시할 수 있습니다.
   */
  username?: string

  /**
   * 브랜드 로고를 클릭했을 때 발생하는 이벤트입니다.
   */
  onBrandClick?: () => void

  /**
   * 로그인 링크를 클릭했을 때 발생하는 이벤트입니다.
   */
  onSignIn?: () => void

  /**
   * 로그아웃 링크를 클릭했을 때 발생하는 이벤트입니다.
   */
  onSignOut?: () => void

  /**
   * 회원가입 링크를 클릭했을 때 발생하는 이벤트입니다.
   */
  onRegister?: () => void

  /**
   * 사용자명을 클릭했을 때 발생하는 이벤트입니다.
   */
  onUserLinkClick?: () => void
}

const Header = (props: HeaderProps): ReactElement => {
  const [t] = useTranslation('header')

  const loginInfo = props.username == null
    ? (
      <div className={styles.loginInfo}>
        <span className={styles.hasRightPadding}>
          {t('not-logged-in')}
        </span>
        <a onClick={props.onSignIn}>{t('sign-in')}</a>
        <span className={styles.divider}>|</span>
        <a onClick={props.onRegister}>{t('new-account')}</a>
      </div>
    )
    : (
      <div className={styles.loginInfo}>
        <span className={styles.hasRightPadding}>
          {replaceStringAsNode(t('logged-in'), '{}', (
            <a key="logged-in" onClick={props.onUserLinkClick}>
              {props.username}
            </a>
          ))}
        </span>
        <a onClick={props.onSignOut}>{t('sign-out')}</a>
      </div>
    )

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a onClick={props.onBrandClick} className={styles.branding}>
          {props.branding}
        </a>

        <nav className={styles.nav}>
          {props.nav}
        </nav>

        {loginInfo}
      </div>
    </header>
  )
}
export default Header
