import advancedFormat from "dayjs/plugin/advancedFormat"
import dayjs from "dayjs"

export const NO_DATE_AVAILABLE = "No date available"
export const DATE_FORMAT = "YYYY-MM-DD"
export const TEXTUAL_DATE_FORMAT = "Do MMMM YYYY"
export const TEXTUAL_DATE_FORMAT_WITH_DAY = "dddd Do MMMM YYYY"
export const TIME_FORMAT = "HH:mm"
export const SHORT_TEXTUAL_DATE_FORMAT = "D MMM YYYY"

dayjs.extend(advancedFormat)

export const formatDate = (format: string) => (dateString?: string): string =>
  dayjs(dateString).format(format)

// e.g. 1st November 2000
export const inTextualDateFormat = formatDate(TEXTUAL_DATE_FORMAT)

// e.g. Wednesday 1st November 2000
export const inTextualDateWithDayFormat = formatDate(
  TEXTUAL_DATE_FORMAT_WITH_DAY,
)

// e.g. 11 Nov 19
export const inShortTextualDateFormat = formatDate(SHORT_TEXTUAL_DATE_FORMAT)

// e.g. 2000-11-28
export const inDateFormat = formatDate(DATE_FORMAT)

// e.g. 15:38
export const inTimeFormat = formatDate(TIME_FORMAT)

// e.g 2019
export const fullYear = new Date().getFullYear()

export const isDueWithin = (hours: number, date: string) =>
  dayjs().add(hours, "hour").isAfter(dayjs(date))

export const getRoundedDay = (offset: number) =>
  dayjs().add(offset, "day").toISOString().split("T")[0]

export const getHoursUntil = (offset: number) =>
  dayjs(getRoundedDay(offset)).diff(dayjs(), "hour")
