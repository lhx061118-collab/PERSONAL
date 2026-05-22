import React from 'react'
import { CheckCircle, Clock, Trash2, Edit2, DollarSign } from 'lucide-react'
import { format, isPast, isToday } from 'date-fns'
import { CATEGORIES } from '../hooks/useTasks'

const TaskCard = ({ task, onToggle, onDelete, onEdit }) => {
  const category = CATEGORIES.find(c => c.id === task.category) || CATEGORIES[CATEGORIES.length - 1]
  const deadlineDate = new Date(task.deadline)
  const isOverdue = isPast(deadlineDate) && !isToday(deadlineDate) && !task.completed

  return (
    <div className={`task-card glass ${task.completed ? 'completed' : ''}`}>
      <div className="task-header">
        <span className="category-tag" style={{ backgroundColor: category.color + '40', color: category.color }}>
          {category.name}
        </span>
        <div className="task-actions">
          <button onClick={() => onEdit(task)} className="action-btn edit">
            <Edit2 size={16} />
          </button>
          <button onClick={() => onDelete(task.id)} className="action-btn delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="task-body">
        <h3 className="task-title">{task.title}</h3>
        {task.client && (
          <div className="task-client" style={{ fontSize: '0.85rem', color: 'rgba(74, 78, 105, 0.8)', fontWeight: '600', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>委託人:</span>
            <span style={{ color: '#7B88FF' }}>{task.client}</span>
          </div>
        )}
        {task.description && <p className="task-desc">{task.description}</p>}
      </div>

      <div className="task-footer">
        <div className="task-info">
          <div className={`info-item ${isOverdue ? 'overdue' : ''}`}>
            <Clock size={14} />
            <span>{format(deadlineDate, 'yyyy/MM/dd')}</span>
          </div>
          {task.price && (
            <div className="info-item price" title="預計金額">
              <DollarSign size={14} />
              <span>{task.price}</span>
              {task.tip && parseInt(task.tip) > 0 && (
                <span className="tip-amount" title="打賞金額">+{task.tip}</span>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => onToggle(task.id)}
          className={`complete-btn ${task.completed ? 'done' : ''}`}
        >
          <CheckCircle size={20} />
        </button>
      </div>

      <style jsx>{`
        .task-card {
          padding: 1.5rem;
          border-radius: var(--border-radius-lg);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: var(--transition);
          position: relative;
          overflow: hidden;
        }

        .task-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: ${category.color};
        }

        .task-card.completed {
          opacity: 0.7;
        }

        .task-card.completed .task-title {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .category-tag {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
        }

        .task-actions {
          display: flex;
          gap: 0.5rem;
          opacity: 0;
          transition: var(--transition);
        }

        .task-card:hover .task-actions {
          opacity: 1;
        }

        .action-btn {
          color: var(--text-muted);
          padding: 0.25rem;
        }

        .action-btn:hover.edit { color: var(--primary); }
        .action-btn:hover.delete { color: #ff8fa3; }

        .task-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .task-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .task-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .task-info {
          display: flex;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .info-item.overdue {
          color: #ff8fa3;
        }

        .info-item.price {
          color: #74c69d;
        }
        
        .tip-amount {
          background: #ffd6ff;
          color: #c9184a;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          margin-left: 4px;
        }

        .complete-btn {
          color: var(--text-muted);
        }

        .complete-btn.done {
          color: #74c69d;
        }

        .complete-btn:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  )
}

export default TaskCard
