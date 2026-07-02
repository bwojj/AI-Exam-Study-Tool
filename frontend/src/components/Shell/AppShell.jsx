import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const isMobile = () => window.innerWidth < 768

export default function AppShell({ children, onLogout, onSelectTest }) {
  const [mobile, setMobile] = useState(isMobile)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile())

  useEffect(() => {
    function handleResize() {
      const nowMobile = isMobile()
      setMobile(nowMobile)
      if (nowMobile) setSidebarOpen(false)
      else setSidebarOpen(true)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: !mobile && sidebarOpen ? '260px 1fr' : '1fr',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {mobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'oklch(0% 0 0 / 0.45)', zIndex: 150 }}
        />
      )}

      {sidebarOpen && (
        <Sidebar onSelectTest={onSelectTest} onClose={() => setSidebarOpen(false)} mobile={mobile} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>
        <Topbar onLogout={onLogout} onToggleSidebar={() => setSidebarOpen(v => !v)} />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
