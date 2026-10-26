export enum DateTimeFormat {
  Date = "DD/MM/YYYY",
  Time = "HH:mm",
  DateTime = "DD/MM/YYYY HH:mm",
}

export type DateTimeFormatType = DateTimeFormat | (string & {})

type DateTimeBaseUnit =
  | "year"
  | "month"
  | "week"
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "millisecond"

export type DateTimeUnit =
  | DateTimeBaseUnit
  | `${DateTimeBaseUnit}s`
  | "y"
  | "M"
  | "w"
  | "d"
  | "h"
  | "m"
  | "s"
  | "ms"

const unitAliases: Record<string, DateTimeBaseUnit> = {
  y: "year",
  M: "month",
  w: "week",
  d: "day",
  h: "hour",
  m: "minute",
  s: "second",
  ms: "millisecond",
}

/** Returns a new date with the given amount added in the specified unit. */
export const add = (
  date: Date,
  amount: number,
  unit: DateTimeUnit = "day",
): Date => {
  const result = new Date(date)
  const normalizedUnit = unitAliases[unit] ?? unit.replace(/s$/, "")

  switch (normalizedUnit) {
    case "year":
    case "month": {
      const day = result.getDate()
      result.setDate(1)
      if (normalizedUnit === "year") {
        result.setFullYear(result.getFullYear() + amount)
      } else {
        result.setMonth(result.getMonth() + amount)
      }
      const endOfMonth = new Date(result)
      endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0)
      result.setDate(Math.min(day, endOfMonth.getDate()))
      return result
    }
    case "week":
    case "day":
      result.setDate(
        result.getDate() + Math.round(amount * (normalizedUnit === "week" ? 7 : 1)),
      )
      return result
    case "hour":
      return new Date(result.getTime() + amount * 3_600_000)
    case "minute":
      return new Date(result.getTime() + amount * 60_000)
    case "second":
      return new Date(result.getTime() + amount * 1_000)
    case "millisecond":
      return new Date(result.getTime() + amount)
    default:
      throw new RangeError(`Unsupported date unit: ${unit}`)
  }
}

export const subtract = (
  date: Date,
  amount: number,
  unit: DateTimeUnit = "day",
): Date => add(date, -amount, unit)

/** Compares the given unit and larger local calendar units; defaults to day. */
export const isDateEqual = (
  first: Date,
  second: Date,
  unit: DateTimeUnit = "day",
): boolean => {
  if (Number.isNaN(first.getTime()) || Number.isNaN(second.getTime())) {
    return false
  }

  const normalizedUnit = unitAliases[unit] ?? unit.replace(/s$/, "")

  if (normalizedUnit === "week") {
    const firstWeekStart = subtract(first, first.getDay(), "day")
    const secondWeekStart = subtract(second, second.getDay(), "day")
    return isDateEqual(firstWeekStart, secondWeekStart, "day")
  }

  if (first.getFullYear() !== second.getFullYear()) return false
  if (normalizedUnit === "year") return true
  if (first.getMonth() !== second.getMonth()) return false
  if (normalizedUnit === "month") return true
  if (first.getDate() !== second.getDate()) return false
  if (normalizedUnit === "day") return true
  if (first.getHours() !== second.getHours()) return false
  if (normalizedUnit === "hour") return true
  if (first.getMinutes() !== second.getMinutes()) return false
  if (normalizedUnit === "minute") return true
  if (first.getSeconds() !== second.getSeconds()) return false
  if (normalizedUnit === "second") return true
  if (normalizedUnit === "millisecond") {
    return first.getTime() === second.getTime()
  }

  throw new RangeError(`Unsupported date unit: ${unit}`)
}

/** Returns Sunday through Saturday for the week containing the given date. */
export const getWeekDates = (date: Date): Date[] => {
  const startOfWeek = subtract(date, date.getDay(), "day")
  return Array.from({ length: 7 }, (_, index) => add(startOfWeek, index, "day"))
}

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
