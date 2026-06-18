import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Icon } from '../Icons'
import { getSession } from '../../services/authStore'
import { logout } from '../../services/api'

const TITLES = {
  '/': 'Library',
  '/test': 'Practice Test',
  '/practice': 'History',
}

function getUsername() {
  const session = getSession()
  if (!session?.access_token) return null
  try {
    const payload = JSON.parse(atob(session.access_token.split('.')[1]))
    return payload.sub ?? null
  } catch {
    return null
  }
}

export default function Topbar({ onLogout }) {
  const { pathname } = useLocation()
  const title = TITLES[pathname] ?? 'Praxis'
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const username = getUsername()
  const initial = (username?.[0] ?? 'U').toUpperCase()

  useEffect(() => {
    if (!open) return
    function handle(e) {
      if (!menuRef.current?.contains(e.target)) setOpen(false)
    }
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handle)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  async function handleLogout() {
    const session = getSession()
    await logout(session?.access_token)
    onLogout()
  }

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      height: 56,
      borderBottom: '1px solid var(--hairline)',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-2)' }}>{title}</span>

      <div ref={menuRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen(v => !v)}
          aria-label="Account menu"
          aria-expanded={open}
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: open ? 'var(--accent)' : 'var(--accent-soft)',
            border: '1px solid var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 600,
            color: open ? 'var(--accent-ink)' : 'var(--accent)',
            cursor: 'pointer',
            transition: 'background .15s ease, color .15s ease',
          }}
        >
          {initial}
        </button>

        {open && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            width: 220,
            background: 'var(--surface)',
            border: '1px solid var(--hairline-strong)',
            borderRadius: 'var(--r-lg)',
            boxShadow: '0 8px 32px oklch(0% 0 0 / 0.35)',
            overflow: 'hidden',
            zIndex: 100,
          }}>
            {/* User info */}
            <div style={{ padding: '14px 16px 12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--accent-ink)',
                  flexShrink: 0,
                }}>
                  {initial}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--ink)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {username ?? 'User'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>Student</div>
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--hairline)' }} />

            {/* Sign out */}
            <div style={{ padding: '6px' }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '9px 10px',
                  borderRadius: 'var(--r-sm)',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--danger)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background .15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'oklch(72% 0.16 25 / 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Icon.LogOut size={15} strokeWidth={1.8} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
