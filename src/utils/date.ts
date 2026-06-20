export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayKey(): string {
  return toDateKey(new Date())
}

export function dateKeyToDate(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function lastNDays(n: number): string[] {
  const days: string[] = []
  const today = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(toDateKey(d))
  }
  return days
}

export function getCurrentStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0
  const completed = new Set(completedDates)
  const cursor = new Date()

  // If today isn't completed yet, count from yesterday so the streak
  // doesn't look broken before the day is even over.
  if (!completed.has(toDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0
  while (completed.has(toDateKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function getCompletionRate(completedDates: string[], days: number): number {
  const completed = new Set(completedDates)
  const done = lastNDays(days).filter((d) => completed.has(d)).length
  return Math.round((done / days) * 100)
}
