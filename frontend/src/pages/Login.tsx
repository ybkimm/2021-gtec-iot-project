import React, { ReactElement, useState } from 'react'
import Card from '../components/Card'
import { useTranslation } from '../internal/i18n'
import styles from './Login.module.css'

const Login = (): ReactElement => {
  const [t] = useTranslation('page/login')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className={styles.loginboxWrapper}>
      <div className={styles.loginbox}>
        <Card>
          <div className={styles.loginboxInner}>
            <h1>{t('title')}</h1>

            <form>
              <label>
                <span>{t('email')}</span>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.currentTarget.value)}
                  placeholder="everyday@sekiramen.studio"/>
              </label>

              <label>
                <span>{t('password')}</span>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.currentTarget.value)}
                  placeholder={'*********'}/>
              </label>

              <input type="submit" value={t('submit') as string}/>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
export default Login
