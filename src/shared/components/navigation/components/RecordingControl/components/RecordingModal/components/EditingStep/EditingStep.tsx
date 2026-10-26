import { colors } from "@/constants/theme"
import ChevronRightIcon from "@/src/shared/components/icons/ChevronRightIcon"
import { StyleSheet, Pressable, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import TranscriptionField from "../TranscriptionField"
import DateTimePicker from "./components/DateTimePicker"
import useEditStep from "./controllers/useEditStep"

type Props = {
  transcribe: string
  initialDateTime: Date
  center: { x: number; y: number }
  buttonSize: number
  onNext: (text: string, dateTime: Date) => void
}

const EditingStep = ({ transcribe, initialDateTime, center, buttonSize, onNext }: Props) => {
  const { editText, setEditText, dateTime, setDateTime } = useEditStep({ transcribe, initialDateTime })
  const { top } = useSafeAreaInsets()

  return (
    <>
      <View style={[styles.content, { paddingTop: top + 16 }]}>
        <DateTimePicker dateTime={dateTime} setDateTime={setDateTime} />
        <TranscriptionField value={editText} onChangeText={setEditText} />
      </View>
      <Pressable
        accessibilityLabel="Next: Select card"
        accessibilityRole="button"
        onPress={() => onNext(editText, dateTime)}
        style={({ pressed }) => [
          styles.nextButton,
          {
            borderRadius: buttonSize / 2,
            height: buttonSize,
            left: center.x - buttonSize / 2,
            top: center.y - buttonSize / 2,
            width: buttonSize,
          },
          pressed && styles.nextButtonPressed,
        ]}
      >
        <ChevronRightIcon color={colors.white} size={24} />
      </Pressable>
    </>
  )
}

export default EditingStep

const styles = StyleSheet.create({
  nextButton: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderColor: colors.background,
    borderWidth: 2,
    justifyContent: "center",
    position: "absolute",
  },
  nextButtonPressed: {
    opacity: 0.75,
  },
  content: {
    paddingHorizontal: 24,
    gap: 24,
    alignItems: "flex-start",
    flex: 1,
  },
})
