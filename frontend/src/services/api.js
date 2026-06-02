
const BASE = 'http://127.0.0.1:8000'; 


export const getReviewGuide = async (formData) => {
  try {
    const response = await fetch(`${BASE}/upload`, {
      method: 'POST',
      body: formData, 
    })
    if(response.ok){
      const data = await response.json(); 
      return data
    }
    else {
      throw new Error(`Server Error ${response.status}`);
    }
  } catch (_) {
    return Error(`Failed to upload`); 
  }
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
