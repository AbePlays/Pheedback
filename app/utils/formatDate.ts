export default function formatDate(date: Date): string {
  date = new Date(date)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
