import type { RefObject } from "react"
import { Pressable, StyleSheet } from "react-native"
import type { View } from "react-native"

import { colors, shadows } from "@/constants/theme"
import MicrophoneIcon from "@/src/shared/components/icons/MicrophoneIcon"
import StopIcon from "@/src/shared/components/icons/StopIcon"

type RecordButtonProps = {
  buttonRef: RefObject<View | null>
  handleLayout: () => void
  isRecording: boolean
  toggleRecording: () => Promise<void>
}

const RecordButton = ({
  buttonRef,
  handleLayout,
  isRecording,
  toggleRecording,
}: RecordButtonProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        isRecording ? "Stop recording" : "Record a journal entry"
      }
      accessibilityState={{ selected: isRecording }}
      onLayout={handleLayout}
      onPress={toggleRecording}
      ref={buttonRef}
      style={({ pressed }) => [
        styles.record,
        isRecording && styles.recording,
        pressed && styles.pressed,
      ]}
    >
      {isRecording ? (
        <StopIcon size={24} color={colors.background} />
      ) : (
        <MicrophoneIcon size={24} color={colors.background} />
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  record: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: "100%",
    height: 72,
    justifyContent: "center",
    left: "50%",
    position: "absolute",
    top: -2,
    transform: [{ translateX: -36 }],
    width: 72,
    ...shadows.record,
  },
  pressed: {
    ...shadows.recordPressed,
  },
  recording: {
    backgroundColor: colors.error,
  },
})

export default RecordButton
