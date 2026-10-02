import { StyleSheet, Text, View } from "react-native"

import { colors } from "@/constants/theme"
import JournalPromptCard from "../components/JournalPromptCard"
import LanguageButton from "../components/LanguageButton"
import useJournalHomeController from "../controllers/useJournalHomeController"

const JournalHomeScreen = () => {
  const controller = useJournalHomeController()

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{controller.journalLabel}</Text>
          <LanguageButton
            accessibilityLabel={controller.switchLanguageLabel}
            label={controller.languageLabel}
            onPress={controller.changeToNextLanguage}
          />
        </View>

        <Text style={styles.title}>{controller.title}</Text>

        <JournalPromptCard
          accessibilityLabel={controller.startWritingLabel}
          description={controller.description}
          prompt={controller.prompt}
          todayLabel={controller.todayLabel}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
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
  title: {
    color: colors.text,
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: -1,
    lineHeight: 42,
    marginBottom: 32,
    marginTop: 8,
    maxWidth: 360,
  },
})

export default JournalHomeScreen
