import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES } from '../hooks/useTasks'

const TaskModal = ({ isOpen, onClose, onSave, taskToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'avatar',
    deadline: '',
    description: '',
    price: '',
    tip: '0',
  })

  useEffect(() => {
    if (taskToEdit) {
      setFormData(taskToEdit)
    } else {
      setFormData({
        title: '',
        category: 'avatar',
        deadline: '',
        description: '',
        price: '',
        tip: '0',
      })
    }
  }, [taskToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content glass">
        <div className="modal-header">
          <h3>{taskToEdit ? '編輯案件' : '新增案件'}</h3>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>案件標題</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="例如：角色設計委託"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>分類</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>截止日期</label>
              <input
                required
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>預計金額 (TWD)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="1000"
              />
            </div>
            <div className="form-group">
              <label>打賞金額 (TWD)</label>
              <input
                type="number"
                value={formData.tip}
                onChange={(e) => setFormData({ ...formData, tip: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>備註內容</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="詳細說明..."
            ></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="cancel-btn">取消</button>
            <button type="submit" className="submit-btn clickable">
              {taskToEdit ? '儲存修改' : '確認新增'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(184, 192, 255, 0.2);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .modal-content {
          width: 90%;
          max-width: 500px;
          padding: 2rem;
          border-radius: var(--border-radius-lg);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-header h3 {
          color: var(--primary);
          font-size: 1.25rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        input, select, textarea {
          padding: 0.75rem 1rem;
          border-radius: var(--border-radius-md);
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid var(--glass-border);
          font-size: 0.95rem;
          color: var(--text-main);
          transition: var(--transition);
        }

        input:focus, select:focus, textarea:focus {
          border-color: var(--primary);
          background: white;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .cancel-btn {
          padding: 0.75rem 1.5rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .submit-btn {
          background: var(--primary);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: var(--border-radius-md);
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(184, 192, 255, 0.3);
        }

        .close-btn {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  )
}

export default TaskModal
