import { useEffect, useState } from 'react'
import type { Habit } from '../types'
import { todayKey } from '../utils/date'
import { HABIT_COLORS, HABIT_EMOJIS } from '../constants'

const STORAGE_KEY = 'habit-tracker:habits'

function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Partial<Habit>[]
    return parsed.map((h) => ({
      id: h.id ?? crypto.randomUUID(),
      name: h.name ?? '',
      emoji: h.emoji ?? HABIT_EMOJIS[0],
      color: h.color ?? HABIT_COLORS[0].value,
      createdAt: h.createdAt ?? new Date().toISOString(),
      completedDates: h.completedDates ?? [],
    }))
  } catch {
    return []
  }
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
  }, [habits])

  function addHabit(name: string, emoji: string, color: string) {
    const habit: Habit = {
      id: crypto.randomUUID(),
      name,
      emoji,
      color,
      createdAt: new Date().toISOString(),
      completedDates: [],
    }
    setHabits((prev) => [...prev, habit])
  }

  function deleteHabit(id: string) {
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }

  function toggleToday(id: string) {
    const key = todayKey()
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const isDone = h.completedDates.includes(key)
        return {
          ...h,
          completedDates: isDone
            ? h.completedDates.filter((d) => d !== key)
            : [...h.completedDates, key],
        }
      }),
    )
  }

  return { habits, addHabit, deleteHabit, toggleToday }
}
