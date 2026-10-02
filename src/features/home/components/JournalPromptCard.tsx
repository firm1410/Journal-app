import { Link } from "expo-router"
import { Pressable, StyleSheet, Text } from "react-native"

import { colors } from "@/constants/theme"

type JournalPromptCardProps = {
  accessibilityLabel: string
  description: string
  prompt: string
  todayLabel: string
}

const JournalPromptCard = ({
  accessibilityLabel,
  description,
  prompt,
  todayLabel,
}: JournalPromptCardProps) => (
  <Link href="/journal?compose=write" asChild>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Text style={styles.eyebrow}>{todayLabel}</Text>
      <Text style={styles.title}>{prompt}</Text>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  </Link>
)

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
  },
  cardPressed: {
    opacity: 0.8,
  },
  eyebrow: {
    color: colors.subtleText,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "600",
    marginTop: 12,
  },
  description: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
})

export default JournalPromptCard
