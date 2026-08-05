import TaskCard from './TaskCard'

const columnConfig = {
  todo: { label: 'To do', dot: 'bg-slate/50' },
  in_progress: { label: 'In progress', dot: 'bg-warning' },
  done: { label: 'Done', dot: 'bg-success' },
}

export default function StatusColumn({ status, tasks, onStatusChange, onDelete, canDelete }) {
  const config = columnConfig[status]

  return (
   <div className="flex flex-col">
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className={`h-2 w-2 rounded-full ${config.dot}`} />
        <h3 className="text-sm font-semibold text-ink">{config.label}</h3>
        <span className="text-xs text-slate">{tasks.length}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 rounded-2xl bg-mist/30 p-2.5">
        {tasks.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-slate/60">No tasks</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              canDelete={canDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}