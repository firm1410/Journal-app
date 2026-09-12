import { getLocales } from "expo-localization"
import { I18n } from "i18n-js"

export type SupportedLocale = "en" | "th"

export const translations = {
  en: {
    journal: "JOURNAL",
    en: "English",
    th: "Thai",
    title: "A quiet place for your thoughts.",
    today: "TODAY",
    prompt: "What is on your mind?",
    description: "Tap here when you are ready to write.",
    startWriting: "Start writing today’s journal entry",
    switchLanguage: "Switch language to %{language}",
    menu: "Menu",
    home: "Home",
    about: "About",
    aboutDescription: "A quiet space for keeping your thoughts close.",
    back: "Back",
  },
  th: {
    journal: "บันทึกประจำวัน",
    en: "อังกฤษ",
    th: "ไทย",
    title: "พื้นที่เงียบ ๆ สำหรับความคิดของคุณ",
    today: "วันนี้",
    prompt: "ตอนนี้คุณกำลังคิดอะไรอยู่?",
    description: "แตะที่นี่เมื่อคุณพร้อมจะเขียน",
    startWriting: "เริ่มเขียนบันทึกประจำวันวันนี้",
    switchLanguage: "เปลี่ยนภาษาเป็น %{language}",
    menu: "เมนู",
    home: "หน้าหลัก",
    about: "เกี่ยวกับ",
    aboutDescription: "พื้นที่เงียบ ๆ สำหรับเก็บความคิดของคุณไว้ใกล้ตัว",
    back: "ย้อนกลับ",
  },
}

export const i18n = new I18n(translations)
i18n.enableFallback = true

export const createI18n = (locale: SupportedLocale) => {
  const instance = new I18n(translations)
  instance.enableFallback = true
  instance.locale = locale
  return instance
}

export const getDeviceLocale = (): SupportedLocale => {
  return getLocales()[0]?.languageCode === "th" ? "th" : "en"
}

i18n.locale = getDeviceLocale()
