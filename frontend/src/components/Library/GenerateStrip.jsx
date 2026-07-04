import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../Icons'
import { getReviewGuide } from '../../services/api'
import LoadingScreen from '../LoadingScreen'
import Modal from '../Modal'
import Dropdown from '../Dropdown'

export default function GenerateStrip({ files, generateConfig, setGenerateConfig, setQuestions, resetTest, formData, onGenerated, setTestId }) {
  const navigate = useNavigate()
  const [generating, setGenerating] = useState(false)
  const [errorType, setErrorType] = useState(null)
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
        setErrorType('parse')
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
        containsMath: data.containsMath?.[key] ?? false,
        type: data.type?.[key],
      }))
      setQuestions(newQuestions)
      setTestId?.(data.test_id)
      setGenerateConfig((prev) => ({ ...prev, name: '' }))
      window.dispatchEvent(new CustomEvent('praxis:test-generated'))
      navigate('/test')
      onGenerated?.()
    } catch (err) {
      setErrorType(err?.status === 429 ? 'capacity' : 'parse')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
    {generating && <LoadingScreen />}
    {errorType === 'parse' && (
      <Modal
        title="Could not parse file"
        message="One or more of your uploaded files could not be read. Please try a different file and generate again."
        onClose={() => setErrorType(null)}
      />
    )}
    {errorType === 'capacity' && (
      <Modal
        title="AI is at capacity"
        message="The AI service has reached its usage limit. Please wait a bit and try generating again."
        onClose={() => setErrorType(null)}
      />
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
        <div className="gen-left">
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
            className="gen-heading"
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
            className="gen-sub"
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
          <div className="gen-name-field" style={{ marginTop: '12px' }}>
            <div className="gen-field-label" style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>
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
          className="gen-controls"
          style={{
            display: 'flex',
            gap: '18px',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          {/* Questions select */}
          <div className="gen-field">
            <div
              className="gen-field-label"
              style={{
                fontSize: '11px',
                color: 'var(--muted)',
                marginBottom: '4px',
                whiteSpace: 'nowrap',
              }}
            >
              Questions
            </div>
            <Dropdown
              value={generateConfig?.count ?? '20'}
              options={['10', '20', '40', '60']}
              onChange={(v) => setGenerateConfig((prev) => ({ ...prev, count: v }))}
            />
          </div>

          {/* Difficulty select */}
          <div className="gen-field">
            <div
              className="gen-field-label"
              style={{
                fontSize: '11px',
                color: 'var(--muted)',
                marginBottom: '4px',
                whiteSpace: 'nowrap',
              }}
            >
              Difficulty
            </div>
            <Dropdown
              value={generateConfig?.difficulty ?? 'Mixed'}
              options={['Mixed', 'Foundational', 'Advanced', 'Exam-grade']}
              onChange={(v) => setGenerateConfig((prev) => ({ ...prev, difficulty: v }))}
            />
          </div>

          {/* Style select */}
          <div className="gen-field">
            <div
              className="gen-field-label"
              style={{
                fontSize: '11px',
                color: 'var(--muted)',
                marginBottom: '4px',
                whiteSpace: 'nowrap',
              }}
            >
              Style
            </div>
            <Dropdown
              value={generateConfig?.style ?? 'Multiple choice'}
              options={['Multiple choice', 'Short answer', 'Mixed format']}
              onChange={(v) => setGenerateConfig((prev) => ({ ...prev, style: v }))}
            />
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
