import { HabitForm } from './components/HabitForm'
import { HabitList } from './components/HabitList'
import { useHabits } from './hooks/useHabits'
import { todayKey } from './utils/date'

function App() {
  const { habits, addHabit, deleteHabit, toggleToday } = useHabits()
  const today = todayKey()
  const doneToday = habits.filter((h) => h.completedDates.includes(today)).length

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">Habit Tracker</h1>
          <p className="mt-1 text-sm text-slate-500">
            {habits.length === 0
              ? 'Add your first daily habit to get started.'
              : `${doneToday} of ${habits.length} habit${habits.length === 1 ? '' : 's'} done today`}
          </p>
        </header>

        <HabitForm onAdd={addHabit} />
        <HabitList habits={habits} onToggleToday={toggleToday} onDelete={deleteHabit} />
      </main>
    </div>
  )
}

export default App
