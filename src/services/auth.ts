const API_BASE = 'http://localhost:3001'

export interface User {
  id: number
  email: string
}

export interface AuthResponse {
  user: User
  message?: string
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) throw new Error('Login failed')
  return res.json()
}

export async function register(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) throw new Error('Registration failed')
  return res.json()
}

export async function getProfile(): Promise<User> {
  const res = await fetch(`${API_BASE}/users/me`, {
    credentials: 'include'
  })
  if (!res.ok) throw new Error('Profile fetch failed')
  return res.json()
}