import { colors, shadows } from "@/constants/theme"
import { formatDateTime } from "@/lib/utils/dateTime"
import CorrectIcon from "@/src/shared/components/icons/CorrectIcon"
import { Dispatch, SetStateAction } from "react"
import type { Animated as AnimatedType } from "react-native"
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { RecordingState } from "../../../models/RecordingInterface"

type Props = {
  center: { x: number; y: number }
  buttonSize: number
  progress: AnimatedType.Value
  transcribe: string
  dateTime: Date
  isComplete: boolean
  setRecordingState: Dispatch<SetStateAction<RecordingState>>
}

const SelectCardStep = ({
  center,
  buttonSize,
  progress,
  transcribe,
  dateTime,
  isComplete,
  setRecordingState,
}: Props) => {
  const { top } = useSafeAreaInsets()

  return (
    <>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: progress,
            paddingTop: top + 16,
            paddingBottom: buttonSize + 40,
          },
        ]}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.date}>
              {formatDateTime(dateTime, "ddd, D MMM YYYY")}
            </Text>
            <Text style={styles.time}>{formatDateTime(dateTime, "HH:mm")}</Text>
          </View>
          <ScrollView style={styles.transcriptScroll}>
            <Text selectable style={styles.transcript}>
              {transcribe}
            </Text>
          </ScrollView>
        </View>
      </Animated.View>
      <Pressable
        accessibilityLabel={isComplete ? "Card confirmed" : "Confirm card"}
        accessibilityRole="button"
        disabled={isComplete}
        onPress={() => setRecordingState(RecordingState.COMPLETED)}
        style={({ pressed }) => [
          styles.confirmButton,
          {
            borderRadius: buttonSize / 2,
            height: buttonSize,
            left: center.x - buttonSize / 2,
            top: center.y - buttonSize / 2,
            width: buttonSize,
          },
          pressed && styles.confirmButtonPressed,
        ]}
      >
        <CorrectIcon color={colors.white} size={24} />
      </Pressable>
    </>
  )
}

export default SelectCardStep

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  card: {
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderRadius: 28,
    boxShadow: shadows.form,
    maxWidth: 640,
    maxHeight: "100%",
    padding: 24,
    width: "100%",
  },
  cardHeader: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 4,
    marginBottom: 20,
    paddingBottom: 16,
  },
  date: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  time: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  transcriptScroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  transcript: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 30,
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderColor: colors.background,
    borderWidth: 2,
    justifyContent: "center",
    position: "absolute",
  },
  confirmButtonPressed: {
    opacity: 0.75,
  },
})
