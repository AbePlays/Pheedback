export default function timeDifference(previous: Date, current = new Date()) {
  const msPerMinute = 60 * 1000
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24
  const msPerMonth = msPerDay * 30

  const elapsed = current.getTime() - previous.getTime()
  const sameYear = current.getFullYear() === previous.getFullYear()

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + 's'
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + 'm'
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + 'h'
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + 'd'
  } else {
    return previous.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: sameYear ? undefined : 'numeric',
    })
  }
}
