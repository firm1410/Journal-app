export enum DateTimeFormat {
  Date = "DD/MM/YYYY",
  Time = "HH:mm",
  DateTime = "DD/MM/YYYY HH:mm",
}

export type DateTimeFormatType = DateTimeFormat | (string & {})

const pad = (value: number, length = 2): string =>
  String(value).padStart(length, "0")

const formatTokens = (date: Date): Record<string, string> => {
  const month = date.getMonth()
  const day = date.getDay()
  const hour = date.getHours()
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]

  return {
    YYYY: String(date.getFullYear()),
    YY: pad(date.getFullYear() % 100),
    MMMM: months[month],
    MMM: months[month].slice(0, 3),
    MM: pad(month + 1),
    M: String(month + 1),
    DD: pad(date.getDate()),
    D: String(date.getDate()),
    dddd: weekdays[day],
    ddd: weekdays[day].slice(0, 3),
    dd: weekdays[day].slice(0, 2),
    d: String(day),
    HH: pad(hour),
    H: String(hour),
    hh: pad(hour % 12 || 12),
    h: String(hour % 12 || 12),
    mm: pad(date.getMinutes()),
    m: String(date.getMinutes()),
    ss: pad(date.getSeconds()),
    s: String(date.getSeconds()),
    SSS: pad(date.getMilliseconds(), 3),
    A: hour < 12 ? "AM" : "PM",
    a: hour < 12 ? "am" : "pm",
  }
}

const formatWithPattern = (date: Date, pattern: string): string => {
  const tokens = formatTokens(date)
  const tokenPattern =
    /\[[^\]]*\]|YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|dd|d|HH|H|hh|h|mm|m|ss|s|SSS|A|a/g

  return pattern.replace(tokenPattern, (token) =>
    token.startsWith("[") ? token.slice(1, -1) : tokens[token],
  )
}

export const formatDateTime = (
  value: Date | string | number,
  format: DateTimeFormatType,
): string => {
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return formatWithPattern(date, format)
}
