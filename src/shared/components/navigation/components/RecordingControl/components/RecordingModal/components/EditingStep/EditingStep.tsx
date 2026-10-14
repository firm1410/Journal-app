import { colors } from "@/constants/theme"
import { StyleSheet, TextInput, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import DateTimePicker from "./components/DateTimePicker"
import useEditStep from "./controllers/useEditStep"

type Props = {
  transcribe: string
}

const EditingStep = ({ transcribe }: Props) => {
  const { editText, dateTime, setDateTime } = useEditStep({ transcribe })
  const { top } = useSafeAreaInsets()

  return (
    <View style={[styles.content, { paddingTop: top + 16 }]}>
      <DateTimePicker dateTime={dateTime} setDateTime={setDateTime} />
      <TextInput style={styles.transcription} value={editText} />
    </View>
  )
}

export default EditingStep

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    flex: 1,
  },
  transcription: {
    color: colors.text,
    fontSize: 48,
    paddingHorizontal: 32,
    textAlign: "center",
  },
})
