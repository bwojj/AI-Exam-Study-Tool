import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Icon } from '../Icons'
import { getGeneratedTests } from '../../services/api'

const NAV = [
  { label: 'Library', icon: Icon.Folder, path: '/' },
  { label: 'History', icon: Icon.Clock, path: '/practice' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [testCount, setTestCount] = useState(0)
  useEffect(() => {
    getGeneratedTests().then(data => { if (Array.isArray(data)) setTestCount(data.length) })
  }, [])

  return (
    <aside style={{
      background: 'var(--bg-2)',
      borderRight: '1px solid var(--hairline)',
      padding: '22px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      overflow: 'hidden',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16, color: 'var(--accent-ink)' }}>P</span>
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.02em', color: 'var(--ink)' }}>Praxis</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.01em' }}>Exam Engine</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map(({ label, icon: NavIcon, path }) => {
          const isActive = pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
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

      {/* Test Count */}
      <div style={{
        padding: '12px 14px',
        borderRadius: 'var(--r-md)',
        border: '1px solid var(--hairline)',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)' }}>
            Tests Generated
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-mono)', lineHeight: 1.15, marginTop: 4 }}>
            {testCount}
          </div>
        </div>
        <Icon.Sparkles size={20} color="var(--accent)" strokeWidth={1.5} />
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
          B
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Blake
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>Student</div>
        </div>
      </div>
    </aside>
  )
}
