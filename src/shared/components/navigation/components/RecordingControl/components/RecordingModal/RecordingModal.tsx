import { Dispatch, SetStateAction, useState } from "react"
import type { Animated as AnimatedType } from "react-native"
import { Animated, Modal, Pressable, StyleSheet, View } from "react-native"

import { colors } from "@/constants/theme"
import CloseIcon from "@/src/shared/components/icons/CloseIcon"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { RecordingState } from "../../models/RecordingInterface"
import EditingStep from "./components/EditingStep/EditingStep"
import SelectCardStep from "./components/SelectCardStep"
import Steps from "./components/Steps/Steps"
import TranscribeStep from "./components/TranscribeStep"

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
  const { top } = useSafeAreaInsets()
  const [draft, setDraft] = useState(() => ({ transcribe, isVisible, text: transcribe, dateTime: new Date() }))

  if (draft.transcribe !== transcribe || draft.isVisible !== isVisible) {
    setDraft({ transcribe, isVisible, text: transcribe, dateTime: new Date() })
  }

  const draftText = draft.text

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
        {!isClosing && (
          <Animated.View style={[styles.content, { opacity: progress }]}>
            <View style={[styles.header, { paddingTop: top + 8 }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cancel recording and close"
                onPress={closeModal}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closeButtonPressed,
                ]}
              >
                <CloseIcon />
              </Pressable>
              <Steps
                recordingState={recordingState}
                onStepChange={setRecordingState}
              />
            </View>
            {recordingState === RecordingState.EDITING ? (
              <EditingStep
                transcribe={draftText}
                initialDateTime={draft.dateTime}
                center={center}
                buttonSize={buttonSize}
                onNext={(text, dateTime) => {
                  setDraft({ transcribe, isVisible, text, dateTime })
                  setRecordingState(RecordingState.SELECT_CARD)
                }}
              />
            ) : recordingState === RecordingState.SELECT_CARD ||
              recordingState === RecordingState.COMPLETED ? (
              <SelectCardStep
                buttonSize={buttonSize}
                center={center}
                setRecordingState={setRecordingState}
                progress={progress}
                transcribe={draftText}
                dateTime={draft.dateTime}
                isComplete={recordingState === RecordingState.COMPLETED}
              />
            ) : (
              <TranscribeStep
                buttonSize={buttonSize}
                center={center}
                setRecordingState={setRecordingState}
                progress={progress}
                transcribe={transcribe}
              />
            )}
          </Animated.View>
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
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    display: "flex",
    flexDirection: "row",
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeButtonPressed: {
    opacity: 0.65,
  },
  expandingCircle: {
    position: "absolute",
    backgroundColor: colors.surface,
    pointerEvents: "none",
  },
})

export default RecordingModal
