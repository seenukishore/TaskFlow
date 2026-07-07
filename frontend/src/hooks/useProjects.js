import { useState, useEffect } from 'react'
import { projectsService } from '../services/projects'

export default function useProjects(orgId) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (orgId) fetchProjects()
  }, [orgId])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await projectsService.getProjects(orgId)
      setProjects(data.data || [])
    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData) => {
    try {
      const data = await projectsService.createProject(orgId, projectData)
      await fetchProjects()
      return data
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const updateProject = async (projectId, projectData) => {
    try {
      const data = await projectsService.updateProject(orgId, projectId, projectData)
      await fetchProjects()
      return data
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const deleteProject = async (projectId) => {
    try {
      await projectsService.deleteProject(orgId, projectId)
      await fetchProjects()
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return {
    projects, loading, error,
    refetch: fetchProjects,
    createProject, updateProject, deleteProject
  }
}