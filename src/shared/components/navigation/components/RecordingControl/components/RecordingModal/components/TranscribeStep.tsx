import { colors } from "@/constants/theme"
import StopIcon from "@/src/shared/components/icons/StopIcon"
import useTranslation from "@/src/shared/i18n/useTranslation"
import { Dispatch, SetStateAction } from "react"
import type { Animated as AnimatedType } from "react-native"
import { Animated, Pressable, StyleSheet, Text } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { RecordingState } from "../../../models/RecordingInterface"

type Props = {
  center: { x: number; y: number }
  buttonSize: number
  progress: AnimatedType.Value
  transcribe: string
  setRecordingState: Dispatch<SetStateAction<RecordingState>>
}

const TranscribeStep = ({
  center,
  buttonSize,
  progress,
  transcribe,
  setRecordingState,
}: Props) => {
  const { top } = useSafeAreaInsets()
  const { t } = useTranslation()

  return (
    <>
      <Animated.View
        style={[styles.content, { opacity: progress, paddingTop: top + 16 }]}
      >
        <Text style={styles.transcription}>{t("liveTranscription")}</Text>
        <Text style={styles.transcription}>{transcribe}</Text>
      </Animated.View>
      <Pressable
        accessibilityLabel="Stop recording"
        accessibilityRole="button"
        onPress={() => setRecordingState(RecordingState.EDITING)}
        style={({ pressed }) => [
          styles.stopButton,
          {
            borderRadius: buttonSize / 2,
            height: buttonSize,
            left: center.x - buttonSize / 2,
            top: center.y - buttonSize / 2,
            width: buttonSize,
          },
          pressed && styles.stopButtonPressed,
        ]}
      >
        <StopIcon color={colors.white} size={24} />
      </Pressable>
    </>
  )
}

export default TranscribeStep

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    flex: 1,
  },
  transcription: {
    color: colors.text,
    fontSize: 48,
    paddingHorizontal: 32,
    textAlign: "center",
  },
  stopButton: {
    alignItems: "center",
    backgroundColor: colors.error,
    borderColor: colors.background,
    borderWidth: 2,
    justifyContent: "center",
    position: "absolute",
  },
  stopButtonPressed: {
    opacity: 0.75,
  },
})
