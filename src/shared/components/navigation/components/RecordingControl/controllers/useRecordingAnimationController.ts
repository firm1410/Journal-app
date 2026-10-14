import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Animated, Easing, useWindowDimensions, View } from "react-native"

const BUTTON_SIZE = 72
const ANIMATION_DURATION = 550

type UseRecordingAnimationControllerProps = {
  isOpen: boolean
  toggleRecording: () => Promise<void>
}

const useRecordingAnimationController = ({
  isOpen,
  toggleRecording,
}: UseRecordingAnimationControllerProps) => {
  const { height, width } = useWindowDimensions()
  const buttonRef = useRef<View>(null)
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 })
  const [isClosing, setIsClosing] = useState(false)
  const [progress] = useState(() => new Animated.Value(0))
  const center = {
    x: buttonPosition.x || width / 2,
    y: buttonPosition.y || height - BUTTON_SIZE / 2,
  }
  const circleDiameter = useMemo(() => {
    const horizontalRadius = Math.max(center.x, width - center.x)
    const verticalRadius = Math.max(center.y, height - center.y)

    return Math.hypot(horizontalRadius, verticalRadius) * 2
  }, [center.x, center.y, height, width])

  const circleScale = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [BUTTON_SIZE / circleDiameter, 1],
      }),
    [circleDiameter, progress],
  )

  const handleButtonLayout = useCallback(() => {
    buttonRef.current?.measureInWindow(
      (x, y, measuredWidth, measuredHeight) => {
        setButtonPosition({
          x: x + measuredWidth / 2,
          y: y + measuredHeight / 2,
        })
      },
    )
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    progress.stopAnimation()
    progress.setValue(0)
    Animated.timing(progress, {
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }, [isOpen, progress])

  const closeModal = useCallback(() => {
    if (isClosing) {
      return
    }

    setIsClosing(true)
    progress.stopAnimation()
    Animated.timing(progress, {
      duration: ANIMATION_DURATION,
      easing: Easing.in(Easing.cubic),
      toValue: 0,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsClosing(false)
      }
    })

    void toggleRecording()
  }, [isClosing, progress, toggleRecording])

  return {
    buttonRef,
    buttonSize: BUTTON_SIZE,
    center,
    circleDiameter,
    circleScale,
    closeModal,
    handleButtonLayout,
    isClosing,
    isVisible: isOpen || isClosing,
    progress,
  }
}

export default useRecordingAnimationController
