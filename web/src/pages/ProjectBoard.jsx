import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import Modal from '../components/Modal'
import StatusColumn from '../components/StatusColumn'
import client from '../api/client'
import { useAuth } from '../context/useAuth'
import { ArrowLeft, Plus, UserPlus, X } from 'lucide-react'

export default function ProjectBoard() {
  const { id } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [memberModalOpen, setMemberModalOpen] = useState(false)
  const [memberEmail, setMemberEmail] = useState('')
  const [memberError, setMemberError] = useState(null)
  const [memberSubmitting, setMemberSubmitting] = useState(false)

  useEffect(() => {
    fetchProject()
    fetchTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function fetchProject() {
    client.get(`/projects/${id}`).then((res) => setProject(res.data))
  }

  function fetchTasks() {
    setLoading(true)
    client.get(`/projects/${id}/tasks`)
      .then((res) => setTasks(res.data))
      .finally(() => setLoading(false))
  }

  async function handleCreateTask(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await client.post(`/projects/${id}/tasks`, {
        title,
        description,
        due_date: dueDate || null,
      })
      setTitle('')
      setDescription('')
      setDueDate('')
      setModalOpen(false)
      fetchTasks()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create task.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAddMember(e) {
    e.preventDefault()
    setMemberError(null)
    setMemberSubmitting(true)
    try {
      await client.post(`/projects/${id}/members`, { email: memberEmail })
      setMemberEmail('')
      setMemberModalOpen(false)
      fetchProject()
    } catch (err) {
      setMemberError(err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Could not add member.')
    } finally {
      setMemberSubmitting(false)
    }
  }

  async function handleRemoveMember(userId) {
    try {
      await client.delete(`/projects/${id}/members/${userId}`)
      fetchProject()
    } catch (err) {
      alert(err.response?.data?.message || 'Could not remove member.')
    }
  }

  async function handleStatusChange(taskId, status) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)))
    try {
      await client.put(`/projects/${id}/tasks/${taskId}`, { status })
    } catch {
      fetchTasks()
    }
  }

  async function handleDelete(taskId) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    try {
      await client.delete(`/projects/${id}/tasks/${taskId}`)
    } catch {
      fetchTasks()
    }
  }

  const isOwner = project?.owner_id === user?.id
  const grouped = {
    todo: tasks.filter((t) => t.status === 'todo'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    done: tasks.filter((t) => t.status === 'done'),
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate hover:text-ink">
          <ArrowLeft size={15} />
          Projects
        </Link>

        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">{project?.name}</h1>
            {project?.description && (
              <p className="mt-1 max-w-2xl text-sm text-slate">{project.description}</p>
            )}
            {project?.members?.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate">Members:</span>
                {project.members.map((m) => (
                  <span
                    key={m.id}
                    className="flex items-center gap-1.5 rounded-full border border-mist bg-white py-1 pl-1 pr-2 text-xs text-ink"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-[10px] font-semibold text-accent">
                      {m.name.charAt(0).toUpperCase()}
                    </span>
                    {m.name}
                    {isOwner && (
                      <button
                        onClick={() => handleRemoveMember(m.id)}
                        title={`Remove ${m.name}`}
                        className="ml-0.5 text-slate hover:text-danger"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            {isOwner && (
              <button
                onClick={() => setMemberModalOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-mist bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-mist/40"
              >
                <UserPlus size={16} />
                <span className="hidden sm:inline">Invite</span>
              </button>
            )}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-4">
            <StatusColumn
              status="todo"
              tasks={grouped.todo}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              canDelete={isOwner}
            />
            <StatusColumn
              status="in_progress"
              tasks={grouped.in_progress}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              canDelete={isOwner}
            />
            <StatusColumn
              status="done"
              tasks={grouped.done}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              canDelete={isOwner}
            />
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Task">
        <form onSubmit={handleCreateTask}>
          {error && (
            <div className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>
          )}
          <label className="mb-1 block text-sm font-medium text-ink">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4 w-full rounded-lg border border-mist px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Design the homepage hero"
          />
          <label className="mb-1 block text-sm font-medium text-ink">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mb-4 w-full resize-none rounded-lg border border-mist px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Optional details"
          />
          <label className="mb-1 block text-sm font-medium text-ink">Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mb-6 w-full rounded-lg border border-mist px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            {submitting ? 'Creating…' : 'Create task'}
          </button>
        </form>
      </Modal>

      <Modal open={memberModalOpen} onClose={() => setMemberModalOpen(false)} title="Invite a member">
        <form onSubmit={handleAddMember}>
          {memberError && (
            <div className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{memberError}</div>
          )}
          <label className="mb-1 block text-sm font-medium text-ink">Email address</label>
          <p className="mb-2 text-xs text-slate">They must already have a TaskForge account.</p>
          <input
            type="email"
            required
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            className="mb-6 w-full rounded-lg border border-mist px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="teammate@example.com"
          />
          <button
            type="submit"
            disabled={memberSubmitting}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            {memberSubmitting ? 'Adding…' : 'Add member'}
          </button>
        </form>
      </Modal>
    </AppLayout>
  )
}