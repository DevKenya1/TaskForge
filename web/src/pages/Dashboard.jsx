import { useState, useEffect } from 'react'
import AppLayout from '../layouts/AppLayout'
import Modal from '../components/Modal'
import ProjectCard from '../components/ProjectCard'
import client from '../api/client'
import { Plus, FolderKanban } from 'lucide-react'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  function fetchProjects() {
    setLoading(true)
    client.get('/projects')
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false))
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await client.post('/projects', { name, description })
      setName('')
      setDescription('')
      setModalOpen(false)
      fetchProjects()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create project.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Projects</h1>
            <p className="mt-1 text-sm text-slate">Everything you own or collaborate on</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Project</span>
          </button>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-mist py-16 text-center">
            <FolderKanban size={36} className="mb-3 text-slate/50" />
            <p className="mb-1 font-medium text-ink">No projects yet</p>
            <p className="mb-4 text-sm text-slate">Create your first project to start tracking tasks.</p>
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Create a project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Project">
        <form onSubmit={handleCreate}>
          {error && (
            <div className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>
          )}
          <label className="mb-1 block text-sm font-medium text-ink">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4 w-full rounded-lg border border-mist px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Marketing site redesign"
          />
          <label className="mb-1 block text-sm font-medium text-ink">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mb-6 w-full resize-none rounded-lg border border-mist px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="What's this project about?"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            {submitting ? 'Creating…' : 'Create project'}
          </button>
        </form>
      </Modal>
    </AppLayout>
  )
}