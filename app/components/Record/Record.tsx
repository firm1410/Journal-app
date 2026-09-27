import MicIcon from "@/app/icon/mic"
import StopIcon from "@/app/icon/stop"
import { colors, shadows } from "@/constants/theme"
import { useCallback, useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"

type Props = {}

const Record = (props: Props) => {
  const [isOn, setIsOn] = useState(false)
  const onRecord = useCallback(() => {
    setIsOn(true)
    if (isOn) {
      setIsOn(false)
    }
  }, [isOn])

  return (
    <>
      <View></View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Record a journal entry"
        onPress={() => onRecord()}
        style={({ pressed }) => [
          styles.record,
          isOn && styles.recordIsOn,
          pressed && styles.recordPressed,
        ]}
      >
        {isOn ? (
          <StopIcon size={24} color={colors.background} />
        ) : (
          <MicIcon size={24} color={colors.background} />
        )}
      </Pressable>
    </>
  )
}

export default Record

const styles = StyleSheet.create({
  record: {
    width: 72,
    height: 72,
    borderRadius: "100%",
    position: "absolute",
    left: "50%",
    top: -2,
    transform: [{ translateX: -36 }],
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.accent,
    ...shadows.record,
  },
  recordPressed: {
    ...shadows.recordPressed,
  },
  recordIsOn: {
    backgroundColor: colors.error,
  },
})
