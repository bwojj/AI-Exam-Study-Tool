import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getGeneratedTests } from '../../services/api'
import { Icon } from '../Icons'

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown date'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function buildQuestions(test) {
  return Object.entries(test.questions).map(([key, value]) => ({
    id: key,
    question: value,
    correctIndex: test.answers[key],
    choices: test.options ? test.options[key] : [],
    body: test.body[key],
    explanation: test.explanation[key],
    topic: test.topic[key],
    containsMarkdown: test.containsMarkdown[key],
    type: test.type?.[key],
  }))
}

function TestRow({ test, onSelect }) {
  const answeredCount = test.userAnswers?.length ?? 0
  const correctCount = test.userAnswers?.filter(ua => ua.correct).length ?? 0
  const total = test.number_of_questions
  const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0
  const hasScore = answeredCount > 0

  return (
    <button
      onClick={() => onSelect(test)}
      style={{
        width: '100%',
        textAlign: 'left',
        background: 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--r-lg)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent)'
        e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-soft)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--hairline)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon.Beaker size={15} strokeWidth={1.6} color="var(--accent)" />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
            {test.name || 'Untitled'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>
            {formatDate(test.date)}
          </span>
          <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>
            {total} question{total !== 1 ? 's' : ''}
          </span>
          {hasScore && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: scorePercent >= 70 ? 'var(--good)' : scorePercent >= 40 ? 'var(--warn)' : 'var(--danger)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {correctCount} / {total} · {scorePercent}%
            </span>
          )}
        </div>
      </div>
      <Icon.ArrowRight size={16} color="var(--muted)" />
    </button>
  )
}

export default function PracticePage({
  setQuestions,
  resetTest,
  setTestId,
  setAnswers,
  setShortAnswerResults,
  setCorrects,
  setReviewMode,
}) {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getGeneratedTests().then(data => {
      if (data instanceof Error) {
        setError('Failed to load tests.')
      } else {
        setTests(data)
      }
      setLoading(false)
    })
  }, [])

  function handleSelect(test) {
    const questions = buildQuestions(test)
    resetTest()

    const newAnswers = {}
    const newSAResults = {}
    const newCorrects = {}
    test.userAnswers?.forEach(ua => {
      const qId = String(ua.question_num)
      const qType = test.type?.[ua.question_num]
      // MC answers may be serialized as strings; coerce to number for strict equality with correctIndex
      newAnswers[qId] = qType === 'short answer' ? ua.answer : Number(ua.answer)
      if (qType === 'short answer') {
        newSAResults[qId] = ua.correct
      }
      newCorrects[qId] = ua.correct
    })

    setTestId(test.id)
    setAnswers(newAnswers)
    setShortAnswerResults(newSAResults)
    setCorrects(newCorrects)
    setReviewMode(true)
    setQuestions(questions)
    navigate('/test')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)', fontSize: 14 }}>
        Loading tests…
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--danger)', fontSize: 14 }}>
        {error}
      </div>
    )
  }

  return (
    <div style={{ padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--ink)', margin: 0 }}>
          Practice
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: '6px 0 0' }}>
          {tests.length} test{tests.length !== 1 ? 's' : ''} generated
        </p>
      </div>

      {tests.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 60, color: 'var(--muted)' }}>
          <Icon.Empty size={40} />
          <p style={{ fontSize: 14, margin: 0 }}>No tests yet. Generate one from the Library.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tests.slice().reverse().map(test => (
            <TestRow key={test.id} test={test} onSelect={handleSelect} />
          ))}
        </div>
      )}
    </div>
  )
}
