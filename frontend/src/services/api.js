
const BASE = 'https://ai-exam-study-tool-production.up.railway.app';

function onUnauthorized() {
  window.dispatchEvent(new CustomEvent('praxis:unauthorized'))
}

function authHeaders() {
  try {
    const session = JSON.parse(localStorage.getItem('praxis_session') ?? sessionStorage.getItem('praxis_session'))
    if (session?.access_token) return { Authorization: `Bearer ${session.access_token}` }
  } catch {
    return {}
  }
  return {}
}

export const getReviewGuide = async (formData) => {
  const response = await fetch(`${BASE}/upload`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  })
  if (response.status === 401) { onUnauthorized(); return null }
  if (!response.ok) throw new Error(`Server Error ${response.status}`)
  return response.json()
}

export const test = async (formData) => {
  const response = await fetch(`${BASE}/upload`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  })
  if (response.status === 401) { onUnauthorized(); return null }
  if (!response.ok) throw new Error(`Server Error ${response.status}`)
  return response.json()
}

export const getGeneratedTests = async () => {
  try {
    const response = await fetch(`${BASE}/tests`, { headers: authHeaders() })
    if (response.status === 401) { onUnauthorized(); return [] }
    if (response.ok) return response.json()
    throw new Error(`Server Error ${response.status}`)
  } catch {
    return []
  }
}

export const signIn = async ({ username, password }) => {
  const form = new URLSearchParams()
  form.append('username', username)
  form.append('password', password)
  const res = await fetch(`${BASE}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const err = new Error(body.detail || 'Sign in failed')
    err.status = res.status
    err.detail = body.detail || ''
    throw err
  }
  return res.json()
}

export const signUp = async ({ name, password }) => {
  const res = await fetch(`${BASE}/auth/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: name, password }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const err = new Error(body.detail || 'Sign up failed')
    err.status = res.status
    err.detail = body.detail || ''
    throw err
  }
  return signIn({ username: name, password })
}

// TODO: backend needs POST /generate
// Request body: { fileIds: string[], count: number, difficulty: string, style: string }
// Expected response: { questions: Array<{ id, topic, question, body, code?, choices: string[], correctIndex: number, explanation: string }> }
export async function logout(token) {
  try {
    await fetch(`${BASE}/auth/logout`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  } catch {
    // best-effort — client clears session regardless
  }
}

export async function generateTest({ fileIds, count, difficulty, style }) {
  const res = await fetch(`${BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ fileIds, count, difficulty, style }),
  })
  if (res.status === 401) { onUnauthorized(); return null }
  if (!res.ok) throw new Error(`Generate failed: ${res.statusText}`)
  return res.json()
}

export async function checkAnswer({ question, gen_answer, user_answer }) {
  const form = new FormData()
  form.append('question', question)
  form.append('gen_answer', gen_answer)
  form.append('user_answer', user_answer)
  const res = await fetch(`${BASE}/check-answer`, {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  })
  if (res.status === 401) { onUnauthorized(); return null }
  if (!res.ok) throw new Error(`Check answer failed: ${res.statusText}`)
  return res.json()
}

export async function updateAnswer({ testId, question, answer, correct }) {
  const form = new FormData()
  form.append('id', String(testId))
  form.append('correct', correct)
  form.append('question', question)
  form.append('answer', answer)
  const res = await fetch(`${BASE}/update-answer`, {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  })
  if (res.status === 401) onUnauthorized()
}

export function extractFeedback(result) {
  return result?.Feedback ?? null
}

export function normalizeCheckAnswer(result) {
  if (typeof result === 'string') return result === 'correct'
  if (result && 'Correct' in result) return result.Correct
  if (result && 'status' in result) return result.status === 'correct'
  return false
}
