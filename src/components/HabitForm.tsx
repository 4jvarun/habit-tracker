import { useState } from 'react'
import type { FormEvent } from 'react'
import { HABIT_COLORS, HABIT_EMOJIS } from '../constants'

interface HabitFormProps {
  onAdd: (name: string, emoji: string, color: string) => void
}

export function HabitForm({ onAdd }: HabitFormProps) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(HABIT_EMOJIS[0])
  const [color, setColor] = useState(HABIT_COLORS[0].value)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed, emoji, color)
    setName('')
    setEmoji(HABIT_EMOJIS[0])
    setColor(HABIT_COLORS[0].value)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New daily habit, e.g. Drink water"
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
        />
        <button
          type="submit"
          className="rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: color }}
          disabled={!name.trim()}
        >
          Add habit
        </button>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-slate-500">Icon</p>
        <div className="flex flex-wrap gap-1.5">
          {HABIT_EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              aria-label={`Use icon ${e}`}
              aria-pressed={emoji === e}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border text-base transition ${
                emoji === e ? 'border-slate-400 bg-slate-100' : 'border-transparent hover:bg-slate-50'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-slate-500">Color</p>
        <div className="flex flex-wrap gap-2">
          {HABIT_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setColor(c.value)}
              aria-label={`Use color ${c.name}`}
              aria-pressed={color === c.value}
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs text-white transition"
              style={{
                backgroundColor: c.value,
                outline: color === c.value ? '2px solid #0f172a' : 'none',
                outlineOffset: '2px',
              }}
            >
              {color === c.value ? '✓' : ''}
            </button>
          ))}
        </div>
      </div>
    </form>
  )
}
