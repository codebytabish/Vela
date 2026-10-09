const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const TOKEN_KEY = 'token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) =>
  t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY)

export async function api(path, { method = 'GET', body } = {}) {
  const token = getToken()
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      ...(body && !isForm ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    if (res.status === 401 && token && path !== '/auth/login') {
      setToken(null)
      window.dispatchEvent(new Event('auth:logout'))
    }
    throw new Error(data.message || `Request failed (${res.status})`)
  }

  if (data.token) setToken(data.token)
  return data
}