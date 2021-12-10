import i18next, { i18n, TFunction } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { useTranslation as useI18n, UseTranslationResponse } from 'react-i18next'
import en from './en.json'
import ko from './ko.json'

let instance: i18n

export function useTranslation (ns?: string): UseTranslationResponse<string, undefined> {
  return useI18n(ns, { i18n: instance })
}

/**
 * I18n 인스턴스를 초기화 합니다.
 */
export function init (): Promise<TFunction> {
  instance = i18next.createInstance()
  return instance.use(LanguageDetector).init({
    fallbackLng: 'en',
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'language',
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
      excludeCacheFor: ['cimode']
    },
    supportedLngs: ['en', 'ko'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    resources: { en, ko }
  })
}
