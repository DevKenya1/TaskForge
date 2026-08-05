import { Calendar } from 'lucide-react'

const statusColors = {
  todo: 'border-l-slate/40',
  in_progress: 'border-l-warning',
  done: 'border-l-success',
}

export default function TaskCard({ task, onStatusChange, onDelete, canDelete }) {
  return (
    <div className={`rounded-xl border border-mist border-l-4 bg-white p-3.5 shadow-sm ${statusColors[task.status]}`}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-ink">{task.title}</p>
        {canDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="shrink-0 text-xs text-slate hover:text-danger"
          >
            ✕
          </button>
        )}
      </div>

      {task.description && (
        <p className="mb-3 line-clamp-2 text-xs text-slate">{task.description}</p>
      )}

      <div className="flex items-center justify-between gap-2">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="rounded-md border border-mist bg-cloud px-2 py-1 text-xs font-medium text-ink outline-none focus:border-primary"
        >
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>

        {task.due_date && (
          <span className="flex items-center gap-1 text-[11px] font-mono text-slate">
            <Calendar size={11} />
            {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      {task.assignee && (
        <div className="mt-2.5 flex items-center gap-1.5 border-t border-mist pt-2.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-[10px] font-semibold text-accent">
            {task.assignee.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-slate">{task.assignee.name}</span>
        </div>
      )}
    </div>
  )
}