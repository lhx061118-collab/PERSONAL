import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

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

// Helper: map database fields back to application fields
const mapFromDb = (dbTask) => ({
    id: dbTask.id,
    title: dbTask.title || '',
    category: dbTask.category || 'avatar',
    deadline: dbTask.deadline || '',
    description: dbTask.description || '',
    price: dbTask.price !== undefined && dbTask.price !== null ? String(dbTask.price) : '0',
    tip: dbTask.tip !== undefined && dbTask.tip !== null ? String(dbTask.tip) : '0',
    completed: dbTask.completed !== undefined && dbTask.completed !== null ? !!dbTask.completed : dbTask.status === '已完成',
    client: dbTask.client || '',
    status: dbTask.status || (dbTask.completed ? '已完成' : '进行中'),
    createdAt: dbTask.created_at || dbTask.createdAt || new Date().toISOString()
})

// Helper: map application fields to database columns
const mapToDb = (task) => ({
    id: task.id,
    title: task.title,
    category: task.category,
    deadline: task.deadline || null,
    description: task.description || '',
    price: parseFloat(task.price) || 0,
    tip: parseFloat(task.tip) || 0,
    completed: !!task.completed,
    client: task.client || '',
    status: task.completed ? '已完成' : '进行中',
    created_at: task.createdAt
})


export const useTasks = () => {
    const isCloud = isSupabaseConfigured()
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : INITIAL_TASKS
    })
    const [loading, setLoading] = useState(isCloud)
    const [error, setError] = useState(null)

    // Load tasks
    useEffect(() => {
        if (!isCloud) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
            return
        }

        const fetchTasks = async () => {
            try {
                setLoading(true)
                const { data, error: fetchErr } = await supabase
                    .from('commissions')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (fetchErr) throw fetchErr

                if (data) {
                    const loadedTasks = data.map(mapFromDb)
                    setTasks(loadedTasks)
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedTasks))
                }
            } catch (err) {
                console.error('Failed to fetch tasks from Supabase:', err)
                setError(err.message)
                // Fallback to local storage
                const saved = localStorage.getItem(STORAGE_KEY)
                if (saved) setTasks(JSON.parse(saved))
            } finally {
                setLoading(false)
            }
        }

        fetchTasks()
    }, [isCloud])

    // Save tasks to localStorage in offline/local mode
    useEffect(() => {
        if (!isCloud) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
        }
    }, [tasks, isCloud])

    const addTask = async (task) => {
        const newTask = {
            ...task,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            completed: false,
        }

        // Optimistically add to local state
        setTasks(prev => [newTask, ...prev])

        if (isCloud) {
            try {
                const { error: insertErr } = await supabase
                    .from('commissions')
                    .insert([mapToDb(newTask)])

                if (insertErr) throw insertErr
            } catch (err) {
                console.error('Failed to add task to Supabase:', err)
                setError(err.message)
                // Revert local state changes
                setTasks(prev => prev.filter(t => t.id !== newTask.id))
            }
        }
    }

    const updateTask = async (id, updatedFields) => {
        let originalTask = null

        // Optimistically update local state
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                originalTask = { ...t }
                return { ...t, ...updatedFields }
            }
            return t
        }))

        if (isCloud) {
            try {
                const currentTasks = [...tasks]
                const targetTask = currentTasks.find(t => t.id === id)
                if (!targetTask) return

                const mergedTask = { ...targetTask, ...updatedFields }
                const { error: updateErr } = await supabase
                    .from('commissions')
                    .update(mapToDb(mergedTask))
                    .eq('id', id)

                if (updateErr) throw updateErr
            } catch (err) {
                console.error('Failed to update task in Supabase:', err)
                setError(err.message)
                // Revert local state changes
                if (originalTask) {
                    setTasks(prev => prev.map(t => t.id === id ? originalTask : t))
                }
            }
        }
    }

    const deleteTask = async (id) => {
        const originalTasks = [...tasks]

        // Optimistically remove from local state
        setTasks(prev => prev.filter(t => t.id !== id))

        if (isCloud) {
            try {
                const { error: deleteErr } = await supabase
                    .from('commissions')
                    .delete()
                    .eq('id', id)

                if (deleteErr) throw deleteErr
            } catch (err) {
                console.error('Failed to delete task from Supabase:', err)
                setError(err.message)
                // Revert local state changes
                setTasks(originalTasks)
            }
        }
    }

    const toggleTaskCompletion = async (id) => {
        const originalTasks = [...tasks]
        let updatedCompleted = false

        // Optimistically toggle completion in local state
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                updatedCompleted = !t.completed
                return { ...t, completed: updatedCompleted }
            }
            return t
        }))

        if (isCloud) {
            try {
                const { error: updateErr } = await supabase
                    .from('commissions')
                    .update({ 
                        completed: updatedCompleted,
                        status: updatedCompleted ? '已完成' : '进行中'
                    })
                    .eq('id', id)

                if (updateErr) throw updateErr
            } catch (err) {
                console.error('Failed to toggle task completion in Supabase:', err)
                setError(err.message)
                // Revert local state changes
                setTasks(originalTasks)
            }
        }
    }

    return {
        tasks,
        loading,
        error,
        isCloudSynced: isCloud,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
    }
}
