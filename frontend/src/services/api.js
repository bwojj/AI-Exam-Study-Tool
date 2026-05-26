const BASE = 'http://localhost:8000'

// TODO: backend needs POST /upload (multipart/form-data)
// Expected response: { id: string, name: string, size: number, type: string, status: 'queued' }
export async function uploadFile(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE}/upload`, { method: 'POST', body: form })
  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`)
  return res.json()
}

// TODO: backend needs GET /files/{id}/status
// Expected response: { id: string, status: 'queued' | 'processing' | 'analyzed' }
export async function getFileStatus(id) {
  const res = await fetch(`${BASE}/files/${id}/status`)
  if (!res.ok) throw new Error(`Status check failed: ${res.statusText}`)
  return res.json()
}

// TODO: backend needs POST /generate
// Request body: { fileIds: string[], count: number, difficulty: string, style: string }
// Expected response: { questions: Array<{ id, topic, question, body, code?, choices: string[], correctIndex: number, explanation: string }> }
export async function generateTest({ fileIds, count, difficulty, style }) {
  const res = await fetch(`${BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileIds, count, difficulty, style }),
  })
  if (!res.ok) throw new Error(`Generate failed: ${res.statusText}`)
  return res.json()
}
