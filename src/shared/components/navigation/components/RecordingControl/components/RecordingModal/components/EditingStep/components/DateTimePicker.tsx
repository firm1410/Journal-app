import { colors, shadows } from "@/constants/theme"
import { formatDateTime, getWeekDates, isDateEqual } from "@/lib/utils/dateTime"
import { Dispatch, SetStateAction, useMemo } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"

type Props = {
  dateTime: Date
  setDateTime: Dispatch<SetStateAction<Date>>
}

const DateTimePicker = ({ dateTime, setDateTime }: Props) => {
  const dateList = useMemo(() => getWeekDates(dateTime), [dateTime])
  const today = new Date()
  today.setHours(23, 59, 59, 999)

  const selectDate = (date: Date) => {
    if (date.getTime() > today.getTime()) return

    setDateTime((current) => {
      const next = new Date(current)
      next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
      return next
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Date</Text>
      <View style={styles.wrapper}>
        {dateList.map((date) => {
          const selected = isDateEqual(dateTime, date, "day")
          const isToday = isDateEqual(date, today, "day")
          const disabled = date.getTime() > today.getTime()

          return (
            <Pressable
              key={date.getTime()}
              accessibilityRole="button"
              accessibilityLabel={`${isToday ? "Today, " : ""}${formatDateTime(date, "dddd, D MMMM YYYY")}`}
              accessibilityState={{ selected, disabled }}
              disabled={disabled}
              onPress={() => selectDate(date)}
              style={({ pressed }) => [
                styles.dateWrapper,
                selected && styles.dateActive,
                pressed && styles.datePressed,
                disabled && styles.dateFuture,
              ]}
            >
              <Text style={[styles.date, selected && styles.activeText]}>
                {isToday ? "Today" : formatDateTime(date, "ddd")}
              </Text>
              <Text style={[styles.day, selected && styles.activeText]}>
                {formatDateTime(date, "D")}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  wrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  dateWrapper: {
    flex: 1,
    minWidth: 0,
    minHeight: 72,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    boxShadow: shadows.button,
  },
  dateActive: {
    backgroundColor: colors.accent,
    boxShadow: shadows.buttonPressed,
  },
  datePressed: {
    boxShadow: shadows.input,
    transform: [{ scale: 0.96 }],
  },
  dateFuture: {
    backgroundColor: colors.surface,
    boxShadow: "none",
    opacity: 0.4,
  },
  date: {
    color: colors.text,
    fontSize: 14,
    textAlign: "center",
  },
  day: {
    color: colors.text,
    fontSize: 28,
    textAlign: "center",
  },
  activeText: {
    color: colors.white,
  },
})

export default DateTimePicker
