import { I18n } from "i18n-js"
import { useState } from "react"
import { SupportedLocale, getDeviceLocale, createI18n } from "../../i18n"

export const useTranslation = () => {
  const [locale, setLocale] = useState<SupportedLocale>(getDeviceLocale())
  const [i18nInstance, setI18nInstance] = useState<I18n>(createI18n(locale))

  const changeLanguage = (newLocale: SupportedLocale) => {
    setLocale(newLocale)
    const newI18nInstance = createI18n(newLocale)
    setI18nInstance(newI18nInstance)
  }

  return { t: i18nInstance.t.bind(i18nInstance), locale, changeLanguage }
}
