// Shared shell — sidebar, topbar, icon set.

const Icon = {
  Folder: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  ),
  Beaker: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 3v6L4 18a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 18l-5-9V3" /><path d="M9 3h6" />
    </svg>
  ),
  Gear: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  ),
  Bell: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  ),
  Cloud: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M16 16a4 4 0 0 0 0-8 6 6 0 0 0-11.7 1.5A4 4 0 0 0 6 16h10z" />
      <path d="M12 12v6" /><path d="m9 15 3-3 3 3" />
    </svg>
  ),
  File: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" />
    </svg>
  ),
  Filter: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 5h18l-7 9v5l-4-2v-3z" />
    </svg>
  ),
  Refresh: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" />
    </svg>
  ),
  More: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" />
    </svg>
  ),
  Flag: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 21V4h12l-2 4 2 4H4" />
    </svg>
  ),
  ArrowLeft: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  ArrowRight: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  ),
  Send: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4z" />
    </svg>
  ),
  Check: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  ),
  X: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 6l12 12M18 6l-6.5 6.5" /><path d="M6 18l5.5-5.5" />
    </svg>
  ),
  Sparkles: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </svg>
  ),
  Node: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="3" />
      <circle cx="5" cy="5" r="2" /><circle cx="19" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
      <path d="M7 6.5l3 3M17 6.5l-3 3M7 17.5l3-3M17 17.5l-3-3" />
    </svg>
  ),
  Plus: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Empty: (p) => (
    <svg className="svg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M3 10h18M8 14h3" />
    </svg>
  ),
};

function Sidebar({ route, setRoute, accuracy, completionTxt, completionPct }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <div className="brand-glyph" />
          <div className="brand-name">Praxis</div>
        </div>
        <div className="brand-sub">Practice tests, generated.</div>
      </div>

      <div className="side-section">
        <div className="side-label">Navigation</div>
        <nav className="side-nav">
          <button
            className={`side-link ${route === 'upload' ? 'active' : ''}`}
            onClick={() => setRoute('upload')}
          >
            <span className="ico"><Icon.Folder /></span>
            Library
          </button>
          <button
            className={`side-link ${route === 'test' ? 'active' : ''}`}
            onClick={() => setRoute('test')}
          >
            <span className="ico"><Icon.Beaker /></span>
            Tests
          </button>
          <button className="side-link" onClick={() => {}}>
            <span className="ico"><Icon.Gear /></span>
            Settings
          </button>
        </nav>
      </div>

      <div className="side-section">
        <div className="side-label">Progress</div>
        <div className="progress-block">
          <div className="progress-row">
            <div className="progress-row-head">
              <span className="k">Accuracy</span>
              <span className="v">{accuracy}</span>
            </div>
            <div className="bar"><i style={{ width: accuracy === '—' ? '0%' : accuracy }} /></div>
          </div>
          <div className="progress-row">
            <div className="progress-row-head">
              <span className="k">Completion</span>
              <span className="v">{completionTxt}</span>
            </div>
            <div className="bar"><i style={{ width: completionPct + '%' }} /></div>
          </div>
        </div>
      </div>

      <div className="side-foot">
        <div className="avatar" style={{ width: 30, height: 30 }}>R7</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="t">Researcher 7492</div>
          <div className="sub">Free plan</div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ title, node, hasNotif }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">{title}</div>
        {node && <div className="topbar-node">{node}</div>}
      </div>
      <div className="topbar-right">
        <button className="icon-btn" aria-label="Notifications">
          <Icon.Bell />
          {hasNotif && <span className="dot" />}
        </button>
        <div className="avatar">R-7</div>
      </div>
    </header>
  );
}

Object.assign(window, { Icon, Sidebar, Topbar });
