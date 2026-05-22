import { useState, useEffect } from 'react'

const STORAGE_KEY = 'freelance_tasks_v1'

export const CATEGORIES = [
    { id: 'avatar', name: '頭像', color: '#B8C0FF' },
    { id: 'halfBody', name: '半身插畫', color: '#FFD6FF' },
    { id: 'mood', name: '氛圍插畫', color: '#E7C6FF' },
    { id: 'chibiIllust', name: 'Q版插畫', color: '#D6DBFF' },
    { id: 'chibiChar', name: 'Q版人物', color: '#A2D2FF' },
]

const INITIAL_TASKS = [
    { id: '1', title: '角色設計委託 - 莉莉', category: 'avatar', deadline: '2026-06-01', description: '全身立繪，含背景。', price: '5000', tip: '0', completed: false, createdAt: new Date().toISOString() },
    { id: '2', title: '場景氛圍委託', category: 'mood', deadline: '2026-05-30', description: '黃昏場景。', price: '8000', tip: '500', completed: true, createdAt: new Date().toISOString() },
    { id: '3', title: 'Q版人物三連發', category: 'chibiChar', deadline: '2026-06-05', description: '三個不同表情。', price: '2000', tip: '0', completed: false, createdAt: new Date().toISOString() },
]

export const useTasks = () => {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : INITIAL_TASKS
    })

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }, [tasks])

    const addTask = (task) => {
        const newTask = {
            ...task,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            completed: false,
        }
        setTasks(prev => [...prev, newTask])
    }

    const updateTask = (id, updatedTask) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updatedTask } : t))
    }

    const deleteTask = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id))
    }

    const toggleTaskCompletion = (id) => {
        setTasks(prev => prev.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        ))
    }

    return {
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
    }
}
