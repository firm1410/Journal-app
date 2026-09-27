import { Link } from "expo-router"
import { Pressable, StyleSheet, Text, View } from "react-native"

import { colors } from "../../constants/theme"
import { type SupportedLocale } from "../../i18n"
import { useTranslation } from "../hooks/useTraslation"

const JournalHomeScreen = () => {
  const { t, locale, changeLanguage } = useTranslation()

  const nextLocale: SupportedLocale = locale === "en" ? "th" : "en"

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{t("journal")}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("switchLanguage", {
              language: t(nextLocale, { locale: nextLocale }),
            })}
            onPress={() => changeLanguage(nextLocale)}
            style={({ pressed }) => [
              styles.languageButton,
              pressed && styles.languageButtonPressed,
            ]}
          >
            <Text style={styles.languageButtonText}>
              {t(nextLocale, { locale: nextLocale })}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.title}>{t("title")}</Text>

        <Link href="/journal?compose=write" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("startWriting")}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
          >
            <Text style={styles.cardEyebrow}>{t("today")}</Text>
            <Text style={styles.cardTitle}>{t("prompt")}</Text>
            <Text style={styles.cardDescription}>{t("description")}</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
  },
  languageButton: {
    borderColor: colors.controlBorder,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  languageButtonPressed: { opacity: 0.65 },
  languageButtonText: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "600",
  },
  menuButton: { marginLeft: 12, padding: 7 },
  menuButtonText: { color: colors.mutedText, fontSize: 22 },
  title: {
    maxWidth: 360,
    color: colors.text,
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: -1,
    lineHeight: 42,
    marginBottom: 32,
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
  },
  cardPressed: { opacity: 0.8 },
  cardEyebrow: {
    color: colors.subtleText,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "600",
    marginTop: 12,
  },
  cardDescription: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
})
export default JournalHomeScreen
