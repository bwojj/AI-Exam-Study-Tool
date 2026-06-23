import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../Icons'
import { getReviewGuide } from '../../services/api'
import LoadingScreen from '../LoadingScreen'

export default function GenerateStrip({ files, generateConfig, setGenerateConfig, setQuestions, resetTest, formData, onGenerated, setTestId }) {
  const navigate = useNavigate()
  const [generating, setGenerating] = useState(false)
  const [uploadError, setUploadError] = useState(false)
  const analyzedCount = files.filter((f) => f.status === 'analyzed').length
  const isEnabled = files.filter((f) => f.status !== 'error').length > 0

  async function handleGenerate() {
    if (!isEnabled) return
    resetTest()
    setGenerating(true)

    if (formData){
      formData.set("type", generateConfig.style);
      formData.set("questions", generateConfig.count);
      formData.set("name", generateConfig.name);
      formData.set("difficulty", generateConfig.difficulty);
    }
    try {
      const data = await getReviewGuide(formData)
      if (!data || data.Error === 'Could not generate') {
        setUploadError(true)
        return
      }
      const newQuestions = Object.entries(data.questions).map(([key, value]) => ({
        id: key,
        question: value,
        choices: data.options?.[key] ?? null,
        correctIndex: data.answers[key],
        body: data.body[key],
        explanation: data.explanation[key],
        topic: data.topic[key],
        containsMarkdown: data.containsMarkdown[key],
        type: data.type?.[key],
      }))
      setQuestions(newQuestions)
      setTestId?.(data.test_id)
      window.dispatchEvent(new CustomEvent('praxis:test-generated'))
      navigate('/test')
      onGenerated?.()
    } catch {
      setUploadError(true)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
    {generating && <LoadingScreen />}
    {uploadError && (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--r-lg)',
            padding: '40px 48px',
            maxWidth: 460,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 32 }}>⚠️</div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', margin: 0, letterSpacing: '-0.02em' }}>
            Could not parse file
          </h2>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.65, margin: 0 }}>
            One or more of your uploaded files could not be read. Please try a different file and generate again.
          </p>
          <button
            onClick={() => setUploadError(false)}
            style={{
              marginTop: 8,
              padding: '9px 24px',
              border: 'none',
              borderRadius: 'var(--r-md)',
              background: 'var(--accent)',
              color: 'var(--accent-ink)',
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    )}
    <div
      style={{
        background: 'linear-gradient(135deg, var(--surface-2), var(--surface))',
        border: '1px solid var(--hairline-strong)',
        borderRadius: 'var(--r-lg)',
        padding: '24px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative glow */}
      <div
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          top: '-40px',
          right: '-40px',
          borderRadius: '50%',
          background: 'var(--accent-soft)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          position: 'relative',
        }}
      >
        {/* Left: eyebrow + heading + body */}
        <div>
          {/* Eyebrow row */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Icon.Sparkles size={14} color="var(--accent)" />
            <span
              style={{
                fontSize: '12px',
                color: 'var(--accent)',
                fontWeight: 500,
              }}
            >
              Practice test
            </span>
          </div>

          <h3
            style={{
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              marginTop: '6px',
              marginBottom: 0,
              color: 'var(--ink)',
            }}
          >
            Generate a test from your materials
          </h3>

          <p
            style={{
              fontSize: '12.5px',
              color: 'var(--ink-2)',
              marginTop: '4px',
              marginBottom: 0,
            }}
          >
            {analyzedCount > 0 ? `${analyzedCount} file(s) ready` : `${files.filter((f) => f.status !== 'error').length} file(s) queued`} · Takes about 8 seconds
          </p>

          {/* Test name */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>
              Test name
            </div>
            <input
              type="text"
              placeholder="e.g. Midterm Review"
              value={generateConfig?.name ?? ''}
              onChange={(e) =>
                setGenerateConfig((prev) => ({ ...prev, name: e.target.value }))
              }
              style={{
                padding: '7px 10px',
                border: '1px solid var(--hairline-strong)',
                borderRadius: 'var(--r-sm)',
                background: 'var(--bg-2)',
                color: 'var(--ink)',
                fontSize: '13px',
                width: '200px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Right: controls + CTA */}
        <div
          style={{
            display: 'flex',
            gap: '18px',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          {/* Questions select */}
          <div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--muted)',
                marginBottom: '4px',
                whiteSpace: 'nowrap',
              }}
            >
              Questions
            </div>
            <select
              value={generateConfig?.count ?? '20'}
              onChange={(e) =>
                setGenerateConfig((prev) => ({ ...prev, count: e.target.value }))
              }
              style={{
                padding: '7px 10px',
                border: '1px solid var(--hairline-strong)',
                borderRadius: 'var(--r-sm)',
                background: 'var(--bg-2)',
                color: 'var(--ink)',
                fontSize: '13px',
                cursor: 'pointer',
                appearance: 'none',
                paddingRight: '24px',
              }}
            >
              {['10', '20', '40', '60'].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty select */}
          <div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--muted)',
                marginBottom: '4px',
                whiteSpace: 'nowrap',
              }}
            >
              Difficulty
            </div>
            <select
              value={generateConfig?.difficulty ?? 'Mixed'}
              onChange={(e) =>
                setGenerateConfig((prev) => ({ ...prev, difficulty: e.target.value }))
              }
              style={{
                padding: '7px 10px',
                border: '1px solid var(--hairline-strong)',
                borderRadius: 'var(--r-sm)',
                background: 'var(--bg-2)',
                color: 'var(--ink)',
                fontSize: '13px',
                cursor: 'pointer',
                appearance: 'none',
                paddingRight: '24px',
              }}
            >
              {['Mixed', 'Foundational', 'Advanced', 'Exam-grade'].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Style select */}
          <div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--muted)',
                marginBottom: '4px',
                whiteSpace: 'nowrap',
              }}
            >
              Style
            </div>
            <select
              value={generateConfig?.style ?? 'Multiple choice'}
              onChange={(e) =>
                setGenerateConfig((prev) => ({ ...prev, style: e.target.value }))
              }
              style={{
                padding: '7px 10px',
                border: '1px solid var(--hairline-strong)',
                borderRadius: 'var(--r-sm)',
                background: 'var(--bg-2)',
                color: 'var(--ink)',
                fontSize: '13px',
                cursor: 'pointer',
                appearance: 'none',
                paddingRight: '24px',
              }}
            >
              {['Multiple choice', 'Short answer', 'Mixed format'].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Generate CTA */}
          <button
            onClick={handleGenerate}
            disabled={!isEnabled}
            style={{
              padding: '9px 20px',
              borderRadius: 'var(--r-md)',
              fontSize: '13.5px',
              fontWeight: 600,
              border: 'none',
              background: isEnabled ? 'var(--accent)' : 'var(--hairline)',
              color: isEnabled ? 'var(--accent-ink)' : 'var(--muted)',
              cursor: isEnabled ? 'pointer' : 'not-allowed',
            }}
          >
            Generate test →
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
