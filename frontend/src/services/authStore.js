const KEY = 'praxis_session'

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY))
  } catch {
    return null
  }
}

// persist=true → survives browser restart (localStorage); false → tab-session only
export function setSession(data, persist = true) {
  const json = JSON.stringify(data)
  if (persist) {
    localStorage.setItem(KEY, json)
    sessionStorage.removeItem(KEY)
  } else {
    sessionStorage.setItem(KEY, json)
    localStorage.removeItem(KEY)
  }
}

export function clearSession() {
  localStorage.removeItem(KEY)
  sessionStorage.removeItem(KEY)
}

export function isSessionValid() {
  const session = getSession()
  if (!session?.access_token) return false
  try {
    const payload = JSON.parse(atob(session.access_token.split('.')[1]))
    if (!payload.exp) return true
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}
