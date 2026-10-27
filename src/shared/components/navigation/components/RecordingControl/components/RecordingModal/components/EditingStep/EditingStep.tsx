import { colors } from "@/constants/theme"
import ChevronRightIcon from "@/src/shared/components/icons/ChevronRightIcon"
import { Dispatch, SetStateAction } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { RecordingState } from "../../../../models/RecordingInterface"
import TranscriptionField from "../TranscriptionField"
import DateTimePicker from "./components/DateTimePicker"
import useEditStep from "./controllers/useEditStep"

type Props = {
  center: { x: number; y: number }
  buttonSize: number
  transcribe: string
  setTranscribe: Dispatch<SetStateAction<string>>
  date: Date
  setDate: Dispatch<SetStateAction<Date>>
  setRecordingState: Dispatch<SetStateAction<RecordingState>>
}

const EditingStep = ({
  transcribe,
  setTranscribe,
  setRecordingState,
  date,
  setDate,
  center,
  buttonSize,
}: Props) => {
  const { onNext } = useEditStep({
    transcribe,
    date,
    setRecordingState,
  })
  return (
    <>
      <View style={[styles.content]}>
        <DateTimePicker dateTime={date} setDateTime={setDate} />
        <TranscriptionField value={transcribe} onChangeText={setTranscribe} />
      </View>
      <Pressable
        accessibilityLabel="Next: Select card"
        accessibilityRole="button"
        onPress={() => onNext()}
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
    paddingTop: 16,
    gap: 24,
    alignItems: "flex-start",
    flex: 1,
  },
})
