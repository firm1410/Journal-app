import { useEffect, useState } from "react"
import { Animated } from "react-native"
import { RecordingState } from "../../../../../models/RecordingInterface"

type Props = {
  recordingState: RecordingState
  onStepChange: (state: RecordingState) => void
}

const stepDefinitions = [
  {
    label: "Transcribe",
    description: "Turn your recording into words.",
    state: RecordingState.DONE_TRANSCRIBING,
  },
  {
    label: "Edit",
    description: "Review and refine your journal entry.",
    state: RecordingState.EDITING,
  },
  {
    label: "Select card",
    description: "Choose a card for your journal entry.",
    state: RecordingState.SELECT_CARD,
  },
] as const

const stepByState: Record<RecordingState, number> = {
  [RecordingState.IDLE]: 0,
  [RecordingState.TRANSCRIBING]: 0,
  [RecordingState.DONE_TRANSCRIBING]: 0,
  [RecordingState.EDITING]: 1,
  [RecordingState.SELECT_CARD]: 2,
  [RecordingState.COMPLETED]: stepDefinitions.length - 1,
}

const RING_SIZE = 64
const STROKE_WIDTH = 4
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const useSteps = ({ recordingState, onStepChange }: Props) => {
  const currentStep = stepByState[recordingState]
  const [progress] = useState(() => new Animated.Value(currentStep))

  useEffect(() => {
    // A short spring that settles in approximately 300 ms.
    const animation = Animated.spring(progress, {
      toValue: currentStep,
      stiffness: 500,
      damping: 24,
      mass: 0.5,
      restDisplacementThreshold: 0.001,
      restSpeedThreshold: 0.001,
      useNativeDriver: false,
    })

    animation.start()
    return () => animation.stop()
  }, [currentStep, progress])

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, stepDefinitions.length - 1],
    outputRange: [CIRCUMFERENCE * (1 - 1 / stepDefinitions.length), 0],
    extrapolate: "clamp",
  })
  const { label, description } = stepDefinitions[currentStep]
  const canGoBack = currentStep > 0
  const isComplete = recordingState === RecordingState.COMPLETED
  const title = isComplete ? "Done" : label
  const subtitle = isComplete ? "Your journal entry is ready." : description
  const stepLabel = `${currentStep + 1} of ${stepDefinitions.length}`

  const goToPreviousStep = () => {
    if (canGoBack) {
      onStepChange(stepDefinitions[currentStep - 1].state)
    }
  }

  return {
    title,
    subtitle,
    stepLabel,
    canGoBack,
    goToPreviousStep,
    accessibilityLabel: `${title}, step ${stepLabel}`,
    ring: {
      size: RING_SIZE,
      strokeWidth: STROKE_WIDTH,
      radius: RADIUS,
      circumference: CIRCUMFERENCE,
      strokeDashoffset,
    },
  }
}

export default useSteps
