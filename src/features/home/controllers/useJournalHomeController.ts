import type { SupportedLocale } from "@/i18n"
import useTranslation from "@/src/shared/i18n/useTranslation"

const useJournalHomeController = () => {
  const { t, locale, changeLanguage } = useTranslation()
  const nextLocale: SupportedLocale = locale === "en" ? "th" : "en"
  const languageLabel = t(nextLocale, { locale: nextLocale })

  const changeToNextLanguage = () => changeLanguage(nextLocale)

  return {
    changeToNextLanguage,
    description: t("description"),
    journalLabel: t("journal"),
    languageLabel,
    prompt: t("prompt"),
    startWritingLabel: t("startWriting"),
    switchLanguageLabel: t("switchLanguage", { language: languageLabel }),
    title: t("title"),
    todayLabel: t("today"),
  }
}

export default useJournalHomeController
