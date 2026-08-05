import { useState, useEffect } from 'react'
import { AuthContext } from './AuthContextObject'
import client from '../api/client'



export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => !!localStorage.getItem('taskforge_token'))

  useEffect(() => {
    const token = localStorage.getItem('taskforge_token')
    if (!token) return

    client.get('/me')
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('taskforge_token'))
      .finally(() => setLoading(false))
  }, [])
  async function login(email, password) {
    const res = await client.post('/login', { email, password })
    localStorage.setItem('taskforge_token', res.data.token)
    setUser(res.data.user)
  }

  async function register(name, email, password, password_confirmation) {
    const res = await client.post('/register', { name, email, password, password_confirmation })
    localStorage.setItem('taskforge_token', res.data.token)
    setUser(res.data.user)
  }

  async function logout() {
    try {
      await client.post('/logout')
    } finally {
      localStorage.removeItem('taskforge_token')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

