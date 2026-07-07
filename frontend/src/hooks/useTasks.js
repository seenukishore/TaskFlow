import { useState, useEffect } from 'react'
import { tasksService } from '../services/tasks'

export default function useTasks(orgId, projectId) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (orgId && projectId) fetchTasks()
  }, [orgId, projectId])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await tasksService.getTasks(orgId, projectId, { limit: 100 })
      setTasks(data.data || [])
    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData) => {
    try {
      const data = await tasksService.createTask(orgId, projectId, taskData)
      await fetchTasks()
      return data
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const updateTask = async (taskId, taskData) => {
    try {
      const data = await tasksService.updateTask(orgId, projectId, taskId, taskData)
      await fetchTasks()
      return data
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await tasksService.deleteTask(orgId, projectId, taskId)
      await fetchTasks()
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return {
    tasks, loading, error,
    refetch: fetchTasks,
    createTask, updateTask, deleteTask
  }
}