import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Icon } from '../Icons'
import Logo from '../Logo'
import { getSession } from '../../services/authStore'
import { getGeneratedTests } from '../../services/api'

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

const NAV = [
  { label: 'Library', icon: Icon.Folder, path: '/' },
  { label: 'Generated Tests', icon: Icon.Clock, path: '/practice' },
]

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function Sidebar({ onSelectTest, onClose, mobile }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const username = getUsername()
  const initial = (username?.[0] ?? 'U').toUpperCase()
  const [tests, setTests] = useState([])

  useEffect(() => {
    getGeneratedTests().then(data => {
      if (!(data instanceof Error)) setTests(data)
    })
  }, [pathname])

  const recents = tests.slice().reverse().slice(0, 5)

  const totalTests = tests.length
  const attempted = tests.filter(t => (t.userAnswers?.length ?? 0) > 0)
  const avgAccuracy = attempted.length > 0
    ? Math.round(
        attempted.reduce((sum, t) => {
          const correct = t.userAnswers.filter(ua => ua.correct).length
          return sum + (correct / t.number_of_questions) * 100
        }, 0) / attempted.length
      )
    : null

  return (
    <aside style={{
      background: 'var(--bg-2)',
      borderRight: '1px solid var(--hairline)',
      padding: '22px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      overflow: 'hidden',
      ...(mobile ? {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: 260,
        zIndex: 200,
      } : {}),
    }}>
      {/* Brand */}
      <Logo size={34} showWordmark={true} />

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map(({ label, icon: NavIcon, path }) => {
          const isActive = pathname === path
          return (
            <button
              key={path}
              onClick={() => { navigate(path); if (mobile) onClose?.() }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 'var(--r-md)',
                border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                background: isActive ? 'var(--accent-soft)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--ink-2)',
                fontSize: 13.5,
                fontWeight: isActive ? 500 : 400,
                width: '100%',
                textAlign: 'left',
              }}
            >
              <NavIcon size={16} strokeWidth={1.6} />
              {label}
            </button>
          )
        })}
      </nav>


      {/* Recents */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 6px', marginBottom: 2 }}>
          Recent
        </div>
        {tests.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--muted)', padding: '3px 6px' }}>No tests yet</div>
        ) : (
          recents.map(test => (
            <button
              key={test.id}
              onClick={() => { onSelectTest(test); if (mobile) onClose?.() }}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'transparent',
                border: 'none',
                padding: '5px 6px',
                borderRadius: 'var(--r-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-3)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: 12.5, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                {test.name || 'Untitled'}
              </span>
              <span style={{ fontSize: 11, color: 'var(--muted)', flexShrink: 0, marginLeft: 8 }}>
                {formatDate(test.date)}
              </span>
            </button>
          ))
        )}
      </div>

      <div style={{
        padding: '10px 12px',
        borderRadius: 'var(--r-md)',
        border: '1px solid var(--hairline)',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Tests Generated</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{totalTests}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Avg Accuracy</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{avgAccuracy !== null ? `${avgAccuracy}%` : '—'}</span>
        </div>
      </div>

      {/* User card */}
      <div style={{
        marginTop: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 'var(--r-md)',
        border: '1px solid var(--hairline)',
        background: 'var(--bg)',
      }}>
        <div style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'var(--accent-soft)',
          border: '1px solid var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--accent)',
          flexShrink: 0,
        }}>
          {initial}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {username ?? 'User'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>Student</div>
        </div>
      </div>
    </aside>
  )
}
