// Praxis — Auth screen (Sign in / Create account)

const AuthIcon = {
  Mail: (p) => (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  ),
  Lock: (p) => (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  ),
  User: (p) => (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
  Eye: (p) => (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: (p) => (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9.9 5.2A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3 3.7M6.1 6.1A16 16 0 0 0 2 12s3.5 7 10 7a9.6 9.6 0 0 0 4-.85" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" />
    </svg>
  ),
  Check: (p) => (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  ),
  Arrow: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  Google: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
      <path fill="#4285F4" d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2-1.9 3.3-4.7 3.3-7.9z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.8A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.7 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2a11 11 0 0 0 0 9.8l3.7-2.8z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.6l3.1-3.1A11 11 0 0 0 2 7.1l3.7 2.8C6.6 7.3 9.1 5.4 12 5.4z" />
    </svg>
  ),
  Shield: (p) => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3 5 6v5c0 4 3 6.5 7 8 4-1.5 7-4 7-8V6l-7-3z" /><path d="m9.5 12 1.8 1.8L15 10" />
    </svg>
  ),
};

const FEATURES = [
  { t: 'Upload any source material', d: 'PDFs, notes, slide decks — the engine reads them all.' },
  { t: 'Exam-grade question synthesis', d: 'Calibrated multiple-choice sets with worked explanations.' },
  { t: 'Track accuracy across sessions', d: 'Per-module mastery, flagged items, and review queues.' },
];

function strengthOf(pw) {
  if (!pw) return -1;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 3) - 1; // -1..2
}

function AuthScreen() {
  const [mode, setMode] = React.useState('signin'); // 'signin' | 'signup'
  const isUp = mode === 'signup';

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [agree, setAgree] = React.useState(false);

  const lvl = strengthOf(pw); // -1 none, 0 weak, 1 fair, 2 strong
  const lvlText = ['Weak', 'Fair', 'Strong'][lvl] || '';

  const submit = (e) => {
    e.preventDefault();
    // Demo only — no real auth.
  };

  return (
    <div className="auth">
      {/* Left context panel */}
      <aside className="auth-aside">
        <div className="auth-brand">
          <div className="brand-glyph" />
          <div className="brand-name">Praxis</div>
          <div className="tag">Exam Engine</div>
        </div>

        <div className="auth-pitch">
          <div className="eyebrow">Practice tests, generated</div>
          <h1>Turn your study material into exams that actually prepare you.</h1>
          <p>
            Drop in your sources and Praxis synthesizes calibrated practice
            tests — with explanations, scoring, and review built in.
          </p>

          <div className="auth-feats">
            {FEATURES.map((f) => (
              <div className="auth-feat" key={f.t}>
                <span className="tick"><AuthIcon.Check /></span>
                <div>
                  <div className="ft">{f.t}</div>
                  <div className="fd">{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-foot">
          <span><AuthIcon.Shield /></span>
          <span>SOC 2 Type II</span>
          <span className="sep">/</span>
          <span>Your sources stay private</span>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-head">
            <h2>{isUp ? 'Create your account' : 'Welcome back'}</h2>
            <p>
              {isUp
                ? 'Start generating practice tests in minutes.'
                : 'Sign in to pick up where you left off.'}
            </p>
          </div>

          <div className="auth-seg" role="tablist">
            <button
              className={!isUp ? 'on' : ''}
              role="tab"
              aria-selected={!isUp}
              onClick={() => setMode('signin')}
            >
              Sign in
            </button>
            <button
              className={isUp ? 'on' : ''}
              role="tab"
              aria-selected={isUp}
              onClick={() => setMode('signup')}
            >
              Create account
            </button>
          </div>

          <div className="auth-sso">
            <button type="button" className="sso-btn">
              <span className="glyph"><AuthIcon.Google /></span>
              Continue with Google
            </button>
          </div>

          <div className="auth-or"><span>or with email</span></div>

          <form className="auth-form" onSubmit={submit}>
            {isUp && (
              <div className="field field-anim">
                <label htmlFor="name">Full name</label>
                <div className="input-wrap">
                  <span className="lead"><AuthIcon.User /></span>
                  <input
                    id="name"
                    type="text"
                    placeholder="Ada Lovelace"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Email</label>
              <div className="input-wrap">
                <span className="lead"><AuthIcon.Mail /></span>
                <input
                  id="email"
                  type="email"
                  placeholder="you@institution.edu"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="pw">
                Password
                {!isUp && <a className="hint-link">Forgot?</a>}
              </label>
              <div className="input-wrap">
                <span className="lead"><AuthIcon.Lock /></span>
                <input
                  id="pw"
                  type={show ? 'text' : 'password'}
                  placeholder={isUp ? 'At least 8 characters' : '••••••••••'}
                  autoComplete={isUp ? 'new-password' : 'current-password'}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                />
                <button
                  type="button"
                  className="reveal"
                  aria-label={show ? 'Hide password' : 'Show password'}
                  onClick={() => setShow((s) => !s)}
                >
                  {show ? <AuthIcon.EyeOff /> : <AuthIcon.Eye />}
                </button>
              </div>

              {isUp && lvl >= 0 && (
                <div className="strength">
                  <div className="track">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className={`seg ${i <= lvl ? 'on-' + lvl : ''}`} />
                    ))}
                  </div>
                  <span className="lvl">{lvlText}</span>
                </div>
              )}
            </div>

            <div className="auth-row">
              {isUp ? (
                <label className="check">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <span className="box"><AuthIcon.Check /></span>
                  <span>I agree to the <a>Terms</a> &amp; <a>Privacy</a></span>
                </label>
              ) : (
                <label className="check">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  <span className="box"><AuthIcon.Check /></span>
                  <span>Keep me signed in</span>
                </label>
              )}
            </div>

            <button type="submit" className="auth-submit">
              {isUp ? 'Create account' : 'Sign in'}
              <AuthIcon.Arrow />
            </button>
          </form>

          <div className="auth-switch">
            {isUp ? (
              <>Already have an account? <button onClick={() => setMode('signin')}>Sign in</button></>
            ) : (
              <>New to Praxis? <button onClick={() => setMode('signup')}>Create an account</button></>
            )}
          </div>

          <div className="auth-legal">
            Protected by reCAPTCHA. Subject to the Praxis{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AuthScreen />);
