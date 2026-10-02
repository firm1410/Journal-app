import { createI18n, getDeviceLocale } from "@/i18n"
import type { SupportedLocale } from "@/i18n"
import type { I18n } from "i18n-js"
import { useState } from "react"

const useTranslation = () => {
  const [locale, setLocale] = useState<SupportedLocale>(getDeviceLocale())
  const [i18nInstance, setI18nInstance] = useState<I18n>(createI18n(locale))

  const changeLanguage = (newLocale: SupportedLocale) => {
    setLocale(newLocale)
    setI18nInstance(createI18n(newLocale))
  }

  return {
    changeLanguage,
    locale,
    t: i18nInstance.t.bind(i18nInstance),
  }
}

export default useTranslation
