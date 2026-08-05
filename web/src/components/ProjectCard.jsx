import { Link } from 'react-router-dom'
import { Users, ArrowRight } from 'lucide-react'

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group flex flex-col rounded-2xl border border-mist bg-white p-5 transition hover:border-primary/40 hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between">
        <h3 className="font-display text-base font-bold text-ink group-hover:text-primary">
          {project.name}
        </h3>
        <ArrowRight size={18} className="mt-0.5 shrink-0 text-slate opacity-0 transition group-hover:opacity-100" />
      </div>
      <p className="mb-4 line-clamp-2 flex-1 text-sm text-slate">
        {project.description || 'No description yet.'}
      </p>
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate">
        <Users size={14} />
        {project.owner?.name}
      </div>
    </Link>
  )
}