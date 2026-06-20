import type { Habit } from '../types'
import { dateKeyToDate, getCompletionRate, getCurrentStreak, lastNDays, todayKey } from '../utils/date'

interface HabitItemProps {
  habit: Habit
  onToggleToday: (id: string) => void
  onDelete: (id: string) => void
}

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function HabitItem({ habit, onToggleToday, onDelete }: HabitItemProps) {
  const today = todayKey()
  const doneToday = habit.completedDates.includes(today)
  const streak = getCurrentStreak(habit.completedDates)
  const completionRate = getCompletionRate(habit.completedDates, 7)
  const completed = new Set(habit.completedDates)
  const days = lastNDays(7)

  function handleRemove() {
    if (window.confirm(`Remove "${habit.name}" and its history? This can't be undone.`)) {
      onDelete(habit.id)
    }
  }

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => onToggleToday(habit.id)}
            aria-pressed={doneToday}
            aria-label={doneToday ? `Mark ${habit.name} not done today` : `Mark ${habit.name} done today`}
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm transition"
            style={
              doneToday
                ? { borderColor: habit.color, backgroundColor: habit.color, color: '#fff' }
                : { borderColor: '#cbd5e1' }
            }
          >
            {doneToday ? '✓' : habit.emoji}
          </button>
          <div>
            <p className="font-medium text-slate-800">
              <span className="mr-1">{habit.emoji}</span>
              {habit.name}
            </p>
            <p className="text-xs text-slate-500">
              {streak > 0 ? `🔥 ${streak} day streak` : 'No streak yet'} · {completionRate}% this week
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          aria-label={`Remove ${habit.name}`}
          title="Remove habit"
          className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        >
          🗑️
        </button>
      </div>

      <div className="mt-3 flex gap-1.5">
        {days.map((day) => {
          const isToday = day === today
          const isDone = completed.has(day)
          return (
            <div key={day} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] text-slate-400">{WEEKDAY_LABELS[dateKeyToDate(day).getDay()]}</span>
              <div
                className="flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-semibold"
                style={{
                  backgroundColor: isDone ? habit.color : '#f1f5f9',
                  color: isDone ? '#fff' : '#94a3b8',
                  boxShadow: isToday ? `0 0 0 2px ${habit.color}66` : undefined,
                }}
              >
                {isDone ? '✓' : ''}
              </div>
            </div>
          )
        })}
      </div>
    </li>
  )
}
