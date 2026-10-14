import { Dispatch, SetStateAction } from "react"
import type { Animated as AnimatedType } from "react-native"
import { Animated, Modal, StyleSheet, View } from "react-native"

import { colors, shadows } from "@/constants/theme"
import { RecordingState } from "../../models/RecordingInterface"
import EditingStep from "./components/EditingStep/EditingStep"
import TranscribeStep from "./components/TranscribeStep"

const STEP_FADE_DURATION = 300

type Props = {
  recordingState: RecordingState
  setRecordingState: Dispatch<SetStateAction<RecordingState>>
  center: { x: number; y: number }
  circleDiameter: number
  circleScale: AnimatedType.AnimatedInterpolation<number>
  closeModal: () => void
  isVisible: boolean
  buttonSize: number
  isClosing: boolean
  progress: AnimatedType.Value
  transcribe: string
}

const RecordingModal = ({
  center,
  circleDiameter,
  circleScale,
  closeModal,
  isVisible,
  buttonSize,
  isClosing,
  progress,
  transcribe,
  recordingState,
  setRecordingState,
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
        {recordingState === RecordingState.EDITING ? (
          <EditingStep transcribe={transcribe} />
        ) : (
          <TranscribeStep
            buttonSize={buttonSize}
            center={center}
            setRecordingState={setRecordingState}
            progress={progress}
            transcribe={transcribe}
          />
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    overflow: "hidden",
  },
  step: {
    flex: 1,
  },
  expandingCircle: {
    position: "absolute",
    backgroundColor: colors.surface,
    pointerEvents: "none",
  },
  stopButton: {
    alignItems: "center",
    backgroundColor: colors.error,
    justifyContent: "center",
    position: "absolute",
    zIndex: 20,
    ...shadows.stop,
  },
  stopButtonPressed: {
    opacity: 0.75,
    ...shadows.stopPressed,
  },
})

export default RecordingModal
