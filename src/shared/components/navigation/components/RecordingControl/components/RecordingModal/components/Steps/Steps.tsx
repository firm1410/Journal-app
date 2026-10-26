import { colors } from "@/constants/theme"
import { Animated, Pressable, StyleSheet, Text, View } from "react-native"
import Svg, { Circle } from "react-native-svg"
import type { RecordingState } from "../../../../models/RecordingInterface"
import useSteps from "./controllers/useSteps"

type Props = {
  recordingState: RecordingState
  onStepChange: (state: RecordingState) => void
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const Steps = ({ recordingState, onStepChange }: Props) => {
  const {
    title,
    subtitle,
    stepLabel,
    canGoBack,
    goToPreviousStep,
    accessibilityLabel,
    ring,
  } = useSteps({ recordingState, onStepChange })

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={
          canGoBack ? "Return to the previous step" : undefined
        }
        accessibilityState={{ disabled: !canGoBack }}
        disabled={!canGoBack}
        onPress={goToPreviousStep}
        style={({ pressed }) => [
          styles.progress,
          { width: ring.size, height: ring.size },
          pressed && styles.progressPressed,
        ]}
      >
        <Svg
          width={ring.size}
          height={ring.size}
          viewBox={`0 0 ${ring.size} ${ring.size}`}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Circle
            cx={ring.size / 2}
            cy={ring.size / 2}
            r={ring.radius}
            fill="none"
            stroke={colors.border}
            strokeWidth={ring.strokeWidth}
          />
          <AnimatedCircle
            cx={ring.size / 2}
            cy={ring.size / 2}
            r={ring.radius}
            fill="none"
            stroke={colors.accent}
            strokeWidth={ring.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={[ring.circumference, ring.circumference]}
            strokeDashoffset={ring.strokeDashoffset}
            rotation={-90}
            origin={`${ring.size / 2}, ${ring.size / 2}`}
          />
        </Svg>
        <Text style={styles.stepLabel}>{stepLabel}</Text>
      </Pressable>
      <View style={styles.copy}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  )
}

export default Steps

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  progress: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  progressPressed: {
    opacity: 0.65,
  },
  stepLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 18,
  },
})
