import RecordButton from "./components/RecordButton/RecordButton"
import RecordingModal from "./components/RecordingModal/RecordingModal"
import useRecordingAnimationController from "./controllers/useRecordingAnimationController"
import useRecordingController from "./controllers/useRecordingController"

const RecordingControl = () => {
  const recordingController = useRecordingController()
  const animationController = useRecordingAnimationController({
    isOpen: recordingController.isRecording,
    toggleRecording: recordingController.toggleRecording,
  })

  return (
    <>
      <RecordButton
        buttonRef={animationController.buttonRef}
        handleLayout={animationController.handleButtonLayout}
        isRecording={recordingController.isRecording}
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
        transcribe={recordingController.transcribe}
      />
    </>
  )
}

export default RecordingControl
