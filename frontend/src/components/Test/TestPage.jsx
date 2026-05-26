import { useState, useEffect } from 'react'
import { Icon } from '../Icons'
import TestStatusBar from './TestStatusBar'
import QuestionCard from './QuestionCard'
import Composer from './Composer'
import Pager from './Pager'
import FinishScreen from './FinishScreen'

export default function TestPage({
  questions,
  answers,
  setAnswers,
  flags,
  setFlags,
  current,
  setCurrent,
  finished,
  setFinished,
  resetTest,
}) {
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setSubmitted(false)
  }, [current])

  if (questions.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 16,
          color: 'var(--muted)',
        }}
      >
        <Icon.Empty size={40} />
        <p style={{ fontSize: 14 }}>No test generated yet. Go to Library to create one.</p>
      </div>
    )
  }

  if (finished) {
    return (
      <FinishScreen
        questions={questions}
        answers={answers}
        resetTest={resetTest}
      />
    )
  }

  const q = questions[current]
  const selectedIndex = answers[q.id] ?? null
  const isLastQuestion = current === questions.length - 1

  function onSelect(idx) {
    if (!submitted) {
      setAnswers(prev => ({ ...prev, [q.id]: idx }))
    }
  }

  function onSubmit() {
    if (selectedIndex !== null) {
      setSubmitted(true)
    }
  }

  function onNext() {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
    } else {
      setFinished(true)
    }
  }

  function onPrev() {
    setCurrent(c => Math.max(0, c - 1))
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px 40px 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <TestStatusBar
        q={q}
        current={current}
        total={questions.length}
        answers={answers}
        flags={flags}
        setFlags={setFlags}
      />
      <QuestionCard
        q={q}
        selectedIndex={selectedIndex}
        onSelect={onSelect}
        submitted={submitted}
        answers={answers}
        onPrev={onPrev}
        onNext={onNext}
        current={current}
        total={questions.length}
      />
      <Composer
        submitted={submitted}
        onSubmit={onSubmit}
        onNext={onNext}
        selectedIndex={selectedIndex}
        isLastQuestion={isLastQuestion}
      />
      <Pager
        questions={questions}
        current={current}
        setCurrent={setCurrent}
        answers={answers}
        flags={flags}
      />
    </div>
  )
}
