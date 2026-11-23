const uploadDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

export function formatUploadDate(isoDate: string) {
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? "Unknown date" : uploadDateFormatter.format(date)
}

/** 1860 → "31:00", 3720 → "1:02:00". */
export function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainder = seconds % 60
  const pad = (value: number) => value.toString().padStart(2, "0")

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(remainder)}`
    : `${minutes}:${pad(remainder)}`
}

/** 1860 → "31 min", 3720 → "1 hr 2 min". */
export function formatDurationLong(totalSeconds: number) {
  const minutes = Math.round(Math.max(0, totalSeconds) / 60)
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60

  if (hours === 0) return `${minutes} min`
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`
}
