import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppShell({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>
        <Topbar />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
