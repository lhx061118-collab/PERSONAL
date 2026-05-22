import React from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CATEGORIES } from '../hooks/useTasks'

const CalendarView = ({ tasks }) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date())

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    })

    return (
        <div className="calendar-container glass">
            <div className="calendar-header">
                <h2>{format(currentMonth, 'yyyy年 M月')}</h2>
                <div className="calendar-nav">
                    <button onClick={prevMonth} className="nav-btn"><ChevronLeft size={20} /></button>
                    <button onClick={() => setCurrentMonth(new Date())} className="today-btn">今天</button>
                    <button onClick={nextMonth} className="nav-btn"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="calendar-grid">
                {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                    <div key={day} className="weekday-label">{day}</div>
                ))}

                {calendarDays.map((day, i) => {
                    const dayTasks = tasks.filter(t => isSameDay(new Date(t.deadline), day))
                    const isCurrentMonth = isSameMonth(day, monthStart)

                    return (
                        <div
                            key={i}
                            className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday(day) ? 'is-today' : ''}`}
                        >
                            <span className="day-number">{format(day, 'd')}</span>
                            <div className="day-tasks">
                                {dayTasks.map(t => (
                                    <div
                                        key={t.id}
                                        className="calendar-task-dot"
                                        title={t.title}
                                        style={{ backgroundColor: (CATEGORIES.find(c => c.id === t.category) || {}).color }}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

            <style jsx>{`
        .calendar-container {
          padding: 2rem;
          border-radius: var(--border-radius-lg);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .calendar-header h2 {
          font-size: 1.25rem;
          color: var(--text-main);
        }

        .calendar-nav {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .nav-btn {
          color: var(--text-muted);
        }

        .today-btn {
          padding: 0.35rem 1rem;
          border-radius: 100px;
          border: 1px solid var(--glass-border);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          background: var(--glass-border);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-md);
          overflow: hidden;
        }

        .weekday-label {
          background: white;
          padding: 0.75rem;
          text-align: center;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .calendar-day {
          background: white;
          min-height: 100px;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .calendar-day.other-month {
          background: #f8f9ff;
          color: #d1d5db;
        }

        .calendar-day.is-today {
          background: #f1f4ff;
        }

        .calendar-day.is-today .day-number {
          background: var(--primary);
          color: white;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 100%;
          font-size: 0.8rem;
        }

        .day-number {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .day-tasks {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .calendar-task-dot {
          width: 8px;
          height: 8px;
          border-radius: 100%;
        }
      `}</style>
        </div>
    )
}

export default CalendarView
