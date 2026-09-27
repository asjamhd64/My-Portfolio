const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')


/**
 * POST /api/contact
 * @param {{ name: string, email: string, subject: string, message: string, website?: string }} payload
 */
export async function submitContact(payload) {
 const res = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    const err = new Error(data?.message || 'Something went wrong')
    err.status = res.status
    err.details = data?.details || null
    throw err
  }

  return data
}
