import React, { useState } from 'react'
import { Plus, Search, Calendar as CalendarIcon, Layout, Settings, Filter, TrendingUp } from 'lucide-react'
import { useTasks } from './hooks/useTasks'
import TaskModal from './components/TaskModal'
import TaskCard from './components/TaskCard'
import CalendarView from './components/CalendarView'
import IncomeOverview from './components/IncomeOverview'
import './App.css'

function App() {
  const { tasks, loading, error, isCloudSynced, addTask, updateTask, deleteTask, toggleTaskCompletion } = useTasks()
  const [activeTab, setActiveTab] = useState('board')
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' ? true :
      filter === 'active' ? !task.completed :
        task.completed
    return matchesSearch && matchesFilter
  })

  const handleOpenAddModal = () => {
    setTaskToEdit(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task)
    setIsModalOpen(true)
  }

  const handleSaveTask = (data) => {
    if (taskToEdit) {
      updateTask(taskToEdit.id, data)
    } else {
      addTask(data)
    }
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar glass">
        <div className="logo">
          <h2>接稿助手</h2>
        </div>
        <div className={`sync-status ${isCloudSynced ? 'connected' : 'local'}`}>
          <span className="dot"></span>
          <span>{isCloudSynced ? '雲端同步中' : '本機儲存'}</span>
        </div>
        <nav>
          <button
            className={`nav-item clickable ${activeTab === 'board' ? 'active' : ''}`}
            onClick={() => setActiveTab('board')}
          >
            <Layout size={20} />
            <span>所有案件</span>
          </button>
          <button
            className={`nav-item clickable ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <CalendarIcon size={20} />
            <span>行事曆</span>
          </button>
          <button
            className={`nav-item clickable ${activeTab === 'income' ? 'active' : ''}`}
            onClick={() => setActiveTab('income')}
          >
            <TrendingUp size={20} />
            <span>收入總覽</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item clickable">
            <Settings size={20} />
            <span>設定</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <div className="search-container glass">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="搜尋案件標題或內容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="add-btn clickable" onClick={handleOpenAddModal}>
            <Plus size={20} />
            <span>新增案件</span>
          </button>
        </header>

        <section className="dashboard-content">
          {activeTab === 'board' ? (
            <div className="board-view">
              <div className="view-header">
                <h1>我的稿件</h1>
                <div className="filters">
                  <button
                    className={`filter-chip clickable ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    全部
                  </button>
                  <button
                    className={`filter-chip clickable ${filter === 'active' ? 'active' : ''}`}
                    onClick={() => setFilter('active')}
                  >
                    進行中
                  </button>
                  <button
                    className={`filter-chip clickable ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                  >
                    已完成
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="empty-state glass">
                  <div className="loading-spinner"></div>
                  <p>正在載入您的案件資料...</p>
                </div>
              ) : filteredTasks.length > 0 ? (
                <div className="task-grid">
                  {filteredTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={toggleTaskCompletion}
                      onDelete={deleteTask}
                      onEdit={handleOpenEditModal}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state glass">
                  <p>目前沒有符合條件的案件，點擊「新增案件」開始管理吧！</p>
                </div>
              )}
            </div>
          ) : activeTab === 'calendar' ? (
            <div className="calendar-view">
              <div className="view-header">
                <h1>行事曆視圖</h1>
              </div>
              <CalendarView tasks={tasks} />
            </div>
          ) : (
            <div className="income-view">
              <div className="view-header">
                <h1>收入總覽</h1>
              </div>
              <IncomeOverview tasks={tasks} />
            </div>
          )}
        </section>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

    </div>
  )
}

export default App
