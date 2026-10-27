import { colors } from "@/constants/theme"
import StopIcon from "@/src/shared/components/icons/StopIcon"
import { Dispatch, SetStateAction } from "react"
import type { Animated as AnimatedType } from "react-native"
import { Animated, Pressable, StyleSheet } from "react-native"
import { RecordingState } from "../../../models/RecordingInterface"
import TranscriptionField from "./TranscriptionField"

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
  return (
    <>
      <Animated.View style={[styles.content, { opacity: progress }]}>
        <TranscriptionField value={transcribe} />
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
    flex: 1,
    gap: 24,
    paddingHorizontal: 24,
    paddingTop: 16,
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
