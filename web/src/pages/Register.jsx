import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { CheckSquare } from 'lucide-react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      await register(name, email, password, passwordConfirmation)
      navigate('/')
    } catch (err) {
      if (err.response?.status === 422) {
        const fieldErrors = {}
        const raw = err.response.data.errors || {}
        Object.keys(raw).forEach((key) => { fieldErrors[key] = raw[key][0] })
        setErrors(fieldErrors)
      } else {
        setErrors({ general: 'Something went wrong. Try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cloud px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <CheckSquare size={24} strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">TaskForge</h1>
          <p className="mt-1 text-sm text-slate">Create your workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-mist bg-white p-6 shadow-sm">
          {errors.general && (
            <div className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              {errors.general}
            </div>
          )}

          <label className="mb-1 block text-sm font-medium text-ink">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-1 w-full rounded-lg border border-mist px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Jane Doe"
          />
          {errors.name && <p className="mb-3 text-xs text-danger">{errors.name}</p>}

          <label className="mb-1 mt-3 block text-sm font-medium text-ink">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-1 w-full rounded-lg border border-mist px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="you@example.com"
          />
          {errors.email && <p className="mb-3 text-xs text-danger">{errors.email}</p>}

          <label className="mb-1 mt-3 block text-sm font-medium text-ink">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-1 w-full rounded-lg border border-mist px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="At least 8 characters"
          />
          {errors.password && <p className="mb-3 text-xs text-danger">{errors.password}</p>}

          <label className="mb-1 mt-3 block text-sm font-medium text-ink">Confirm password</label>
          <input
            type="password"
            required
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="mb-6 mt-1 w-full rounded-lg border border-mist px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}