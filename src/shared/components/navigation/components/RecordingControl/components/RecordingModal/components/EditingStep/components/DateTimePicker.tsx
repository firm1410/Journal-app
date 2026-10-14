import colors from "@/constants/theme"
import { formatDateTime } from "@/lib/utils/dateTime"
import { Dispatch, SetStateAction } from "react"
import { StyleSheet, Text, View } from "react-native"

type Props = {
  dateTime: Date
  setDateTime: Dispatch<SetStateAction<Date>>
}

const DateTimePicker = ({ dateTime }: Props) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.dateWrapper}>
        <Text style={styles.date}>{formatDateTime(dateTime, "ddd")}</Text>
        <Text style={styles.date}>{formatDateTime(dateTime, "D MMM")}</Text>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
  },
  dateWrapper: {
    display: "flex",
  },
  date: {
    color: colors.text,
    fontSize: 24,
    paddingHorizontal: 32,
    textAlign: "center",
  },
  time: {
    color: colors.text,
    fontSize: 48,
    paddingHorizontal: 32,
    textAlign: "center",
  },
})
export default DateTimePicker
