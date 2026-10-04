import type { Animated as AnimatedType } from "react-native"
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native"

import { colors } from "@/constants/theme"
import StopIcon from "@/src/shared/components/icons/StopIcon"

type Props = {
  buttonSize: number
  center: { x: number; y: number }
  circleDiameter: number
  circleScale: AnimatedType.AnimatedInterpolation<number>
  closeModal: () => void
  isClosing: boolean
  isVisible: boolean
  progress: AnimatedType.Value
  transcribe: string
}

const RecordingModal = ({
  buttonSize,
  center,
  circleDiameter,
  circleScale,
  closeModal,
  isClosing,
  isVisible,
  progress,
  transcribe,
}: Props) => {
  if (!isVisible) {
    return null
  }

  return (
    <Modal
      animationType="none"
      navigationBarTranslucent
      onRequestClose={closeModal}
      statusBarTranslucent
      transparent
      visible={isVisible}
    >
      <View style={styles.modal}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.expandingCircle,
            {
              borderRadius: circleDiameter / 2,
              height: circleDiameter,
              left: center.x - circleDiameter / 2,
              top: center.y - circleDiameter / 2,
              transform: [{ scale: circleScale }],
              width: circleDiameter,
            },
          ]}
        />

        <Animated.View style={[styles.content, { opacity: progress }]}>
          <Text style={styles.transcription}>{transcribe}</Text>
        </Animated.View>

        <Pressable
          accessibilityLabel="Stop recording"
          accessibilityRole="button"
          disabled={isClosing}
          onPress={closeModal}
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
          <StopIcon color={colors.background} size={24} />
        </Pressable>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    overflow: "hidden",
  },
  expandingCircle: {
    backgroundColor: colors.surface,
    position: "absolute",
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
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

export default RecordingModal
