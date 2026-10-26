import RecordButton from "./components/RecordButton/RecordButton"
import RecordingModal from "./components/RecordingModal/RecordingModal"
import useRecordingAnimationController from "./controllers/useRecordingAnimationController"
import useRecordingController from "./controllers/useRecordingController"
import { RecordingState } from "./models/RecordingInterface"

const RecordingControl = () => {
  const recordingController = useRecordingController()
  const animationController = useRecordingAnimationController({
    isOpen: recordingController.recordingState !== RecordingState.IDLE,
    cancelRecording: recordingController.cancelRecording,
  })

  return (
    <>
      <RecordButton
        buttonRef={animationController.buttonRef}
        handleLayout={animationController.handleButtonLayout}
        recordingState={recordingController.recordingState}
        toggleRecording={recordingController.toggleRecording}
      />

      <RecordingModal
        buttonSize={animationController.buttonSize}
        center={animationController.center}
        circleDiameter={animationController.circleDiameter}
        circleScale={animationController.circleScale}
        closeModal={animationController.closeModal}
        isClosing={animationController.isClosing}
        isVisible={animationController.isVisible}
        progress={animationController.progress}
        recordingState={recordingController.recordingState}
        setRecordingState={recordingController.setRecordingState}
        transcribe={recordingController.transcribe}
      />
    </>
  )
}

export default RecordingControl
