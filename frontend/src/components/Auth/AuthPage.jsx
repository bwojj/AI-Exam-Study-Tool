import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../Icons'
import { signIn, signUp } from '../../services/api'
import { setSession } from '../../services/authStore'
import './auth.css'

const BASE = 'http://127.0.0.1:8000'

const FEATURES = [
  { t: 'Upload any source material', d: 'PDFs, notes, slide decks — the engine reads them all.' },
  { t: 'Exam-grade question synthesis', d: 'Calibrated multiple-choice sets with worked explanations.' },
  { t: 'Track accuracy across sessions', d: 'Per-module mastery, flagged items, and review queues.' },
]

function strengthOf(pw) {
  if (!pw) return -1
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) s++
  return Math.min(s, 3) - 1 // -1..2
}

export default function AuthPage({ onAuthed }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const isUp = mode === 'signup'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(true)
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({}) // { email?, password?, general? }

  const lvl = strengthOf(pw)
  const lvlText = ['Weak', 'Fair', 'Strong'][lvl] ?? ''

  function switchMode(m) {
    setMode(m)
    setErrors({})
    setPw('')
    setShow(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (isUp && !agree) {
      setErrors({ general: 'You must agree to the Terms & Privacy to continue.' })
      return
    }
    setLoading(true)
    setErrors({})
    try {
      const data = isUp
        ? await signUp({ name, email, password: pw })
        : await signIn({ email, password: pw })
      setSession(data, isUp ? true : remember)
      onAuthed()
    } catch (err) {
      const status = err?.status
      const detail = (err?.detail ?? '').toLowerCase()
      if (isUp) {
        if (status === 409 || detail.includes('email') || detail.includes('exist')) {
          setErrors({ email: 'An account with this email already exists.' })
        } else if (detail.includes('password') || detail.includes('weak')) {
          setErrors({ password: 'Password does not meet the requirements.' })
        } else {
          setErrors({ general: 'Unable to create account. Please try again.' })
        }
      } else {
        if (status === 401 || detail.includes('invalid') || detail.includes('credential') || detail.includes('incorrect')) {
          setErrors({ general: 'Incorrect email or password.' })
        } else {
          setErrors({ general: 'Sign in failed. Please try again.' })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  function handleGoogleSSO() {
    window.location.href = `${BASE}/auth/google`
  }

  function handleForgot() {
    navigate('/forgot-password')
  }

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
            {FEATURES.map(f => (
              <div className="auth-feat" key={f.t}>
                <span className="tick">
                  <Icon.Check size={13} strokeWidth={2.2} />
                </span>
                <div>
                  <div className="ft">{f.t}</div>
                  <div className="fd">{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-foot">
          <Icon.Shield size={14} strokeWidth={1.6} />
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
              type="button"
              className={!isUp ? 'on' : ''}
              role="tab"
              aria-selected={!isUp}
              onClick={() => switchMode('signin')}
            >
              Sign in
            </button>
            <button
              type="button"
              className={isUp ? 'on' : ''}
              role="tab"
              aria-selected={isUp}
              onClick={() => switchMode('signup')}
            >
              Create account
            </button>
          </div>

          <div className="auth-sso">
            <button type="button" className="sso-btn" onClick={handleGoogleSSO}>
              <span className="glyph"><Icon.Google /></span>
              Continue with Google
            </button>
          </div>

          <div className="auth-or"><span>or with email</span></div>

          {errors.general && (
            <div className="auth-error" role="alert">{errors.general}</div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isUp && (
              <div className="field field-anim">
                <label htmlFor="auth-name">Full name</label>
                <div className="input-wrap">
                  <span className="lead">
                    <Icon.User size={17} strokeWidth={1.6} />
                  </span>
                  <input
                    id="auth-name"
                    type="text"
                    placeholder="Ada Lovelace"
                    autoComplete="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="field">
              <label htmlFor="auth-email">Email</label>
              <div className="input-wrap">
                <span className="lead">
                  <Icon.Mail size={17} strokeWidth={1.6} />
                </span>
                <input
                  id="auth-email"
                  type="email"
                  placeholder="you@institution.edu"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              {errors.email && (
                <div className="field-error" role="alert">{errors.email}</div>
              )}
            </div>

            <div className="field">
              <label htmlFor="auth-pw">
                Password
                {!isUp && (
                  <button type="button" className="hint-link" onClick={handleForgot}>
                    Forgot?
                  </button>
                )}
              </label>
              <div className="input-wrap">
                <span className="lead">
                  <Icon.Lock size={17} strokeWidth={1.6} />
                </span>
                <input
                  id="auth-pw"
                  type={show ? 'text' : 'password'}
                  placeholder={isUp ? 'At least 8 characters' : '••••••••••'}
                  autoComplete={isUp ? 'new-password' : 'current-password'}
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="reveal"
                  aria-label={show ? 'Hide password' : 'Show password'}
                  onClick={() => setShow(s => !s)}
                >
                  {show
                    ? <Icon.EyeOff size={17} strokeWidth={1.6} />
                    : <Icon.Eye size={17} strokeWidth={1.6} />}
                </button>
              </div>

              {isUp && lvl >= 0 && (
                <div className="strength">
                  <div className="track">
                    {[0, 1, 2].map(i => (
                      <span key={i} className={`seg ${i <= lvl ? `on-${lvl}` : ''}`} />
                    ))}
                  </div>
                  <span className="lvl">{lvlText}</span>
                </div>
              )}
              {errors.password && (
                <div className="field-error" role="alert">{errors.password}</div>
              )}
            </div>

            <div className="auth-row">
              {isUp ? (
                <label className="check">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={e => setAgree(e.target.checked)}
                  />
                  <span className="box"><Icon.Check size={13} strokeWidth={2.2} /></span>
                  <span>
                    I agree to the{' '}
                    <a href="#" onClick={e => e.stopPropagation()}>Terms</a>
                    {' '}&amp;{' '}
                    <a href="#" onClick={e => e.stopPropagation()}>Privacy</a>
                  </span>
                </label>
              ) : (
                <label className="check">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                  />
                  <span className="box"><Icon.Check size={13} strokeWidth={2.2} /></span>
                  <span>Keep me signed in</span>
                </label>
              )}
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading || (isUp && !agree)}
            >
              {loading
                ? (isUp ? 'Creating account…' : 'Signing in…')
                : (isUp ? 'Create account' : 'Sign in')}
              {!loading && <Icon.ArrowRight size={16} strokeWidth={2} />}
            </button>
          </form>

          <div className="auth-switch">
            {isUp ? (
              <>Already have an account?{' '}
                <button type="button" onClick={() => switchMode('signin')}>Sign in</button>
              </>
            ) : (
              <>New to Praxis?{' '}
                <button type="button" onClick={() => switchMode('signup')}>Create an account</button>
              </>
            )}
          </div>

          <div className="auth-legal">
            Protected by reCAPTCHA. Subject to the Praxis{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </main>
    </div>
  )
}
