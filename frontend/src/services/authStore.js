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
