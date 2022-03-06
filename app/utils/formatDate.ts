export default function formatDate(date: Date): string {
  date = new Date(date)
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}
