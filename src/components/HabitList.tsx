import type { Habit } from '../types'
import { HabitItem } from './HabitItem'

interface HabitListProps {
  habits: Habit[]
  onToggleToday: (id: string) => void
  onDelete: (id: string) => void
}

export function HabitList({ habits, onToggleToday, onDelete }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
        No habits yet — add one above to start tracking.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} onToggleToday={onToggleToday} onDelete={onDelete} />
      ))}
    </ul>
  )
}
