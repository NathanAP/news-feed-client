import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en/common.json'
import pt from './locales/pt/common.json'

void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { common: en },
            pt: { common: pt },
        },
        fallbackLng: 'en',
        supportedLngs: ['en', 'pt'],
        defaultNS: 'common',
        interpolation: { escapeValue: false },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    })

export default i18n
