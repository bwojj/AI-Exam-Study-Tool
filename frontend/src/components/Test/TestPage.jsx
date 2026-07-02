import { useState, useEffect, useRef } from 'react'
import { Icon } from '../Icons'
import TestStatusBar from './TestStatusBar'
import QuestionCard from './QuestionCard'
import Composer from './Composer'
import Pager from './Pager'
import FinishScreen from './FinishScreen'
import { checkAnswer, normalizeCheckAnswer, extractFeedback, updateAnswer } from '../../services/api'

export default function TestPage({
  questions,
  answers,
  setAnswers,
  shortAnswerResults,
  setShortAnswerResults,
  flags,
  setFlags,
  current,
  setCurrent,
  finished,
  setFinished,
  resetTest,
  testId,
  corrects,
  setCorrects,
  reviewMode,
}) {
  const [submitted, setSubmitted] = useState(false)
  const [checkingAnswer, setCheckingAnswer] = useState(false)
  const [shortAnswerFeedbacks, setShortAnswerFeedbacks] = useState({})
  const prevCurrentRef = useRef(current)

  useEffect(() => {
    const prev = prevCurrentRef.current
    prevCurrentRef.current = current
    if (prev !== current) {
      const prevQ = questions[prev]
      if (prevQ?.type === 'short answer' && !(prevQ.id in corrects)) {
        setAnswers(a => ({ ...a, [prevQ.id]: '' }))
      }
    }
    setSubmitted(false)
    setCheckingAnswer(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        shortAnswerResults={shortAnswerResults}
        resetTest={resetTest}
      />
    )
  }

  const q = questions[current]
  const isShortAnswer = q.type === 'short answer'
  const selectedIndex = isShortAnswer ? null : (answers[q.id] ?? null)
  const userAnswerText = isShortAnswer ? (answers[q.id] ?? '') : ''
  const isLastQuestion = current === questions.length - 1
  const canSubmit = isShortAnswer
    ? userAnswerText.trim().length > 0
    : selectedIndex !== null

  const hasStoredAnswer = q.id in corrects
  const effectiveSubmitted = submitted || (reviewMode && hasStoredAnswer)

  const correctCount = Object.values(corrects).filter(Boolean).length

  function onSelect(idx) {
    if (!effectiveSubmitted && !isShortAnswer) {
      setAnswers(prev => ({ ...prev, [q.id]: idx }))
    }
  }

  function onAnswerTextChange(text) {
    if (!effectiveSubmitted) {
      setAnswers(prev => ({ ...prev, [q.id]: text }))
    }
  }

  async function onSubmit() {
    if (isShortAnswer) {
      const text = userAnswerText.trim()
      if (!text) return
      setCheckingAnswer(true)
      try {
        const raw = await checkAnswer({
          question: q.question,
          gen_answer: String(q.correctIndex),
          user_answer: text,
        })
        const isCorrect = normalizeCheckAnswer(raw)
        setShortAnswerResults(prev => ({ ...prev, [q.id]: isCorrect }))
        setCorrects(prev => ({ ...prev, [q.id]: isCorrect }))
        setShortAnswerFeedbacks(prev => ({ ...prev, [q.id]: extractFeedback(raw) }))
        updateAnswer({ testId, question: q.id, answer: text, correct: isCorrect })
        setSubmitted(true)
      } finally {
        setCheckingAnswer(false)
      }
    } else {
      if (selectedIndex !== null) {
        const isCorrect = selectedIndex === q.correctIndex
        setCorrects(prev => ({ ...prev, [q.id]: isCorrect }))
        updateAnswer({ testId, question: q.id, answer: selectedIndex, correct: isCorrect })
        setSubmitted(true)
      }
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
      className="test-page"
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
        correctCount={correctCount}
      />
      <QuestionCard
        key={q.id}
        q={q}
        selectedIndex={selectedIndex}
        onSelect={onSelect}
        submitted={effectiveSubmitted}
        answers={answers}
        onPrev={onPrev}
        onNext={onNext}
        current={current}
        total={questions.length}
        isShortAnswer={isShortAnswer}
        userAnswerText={userAnswerText}
        onAnswerTextChange={onAnswerTextChange}
        shortAnswerCorrect={shortAnswerResults[q.id] ?? null}
        storedCorrect={q.id in corrects ? corrects[q.id] : null}
        shortAnswerFeedback={shortAnswerFeedbacks[q.id] ?? null}
        containsMath={q.containsMath ?? false}
      />
      <Composer
        submitted={effectiveSubmitted}
        onSubmit={onSubmit}
        onNext={onNext}
        canSubmit={canSubmit}
        isLastQuestion={isLastQuestion}
        checkingAnswer={checkingAnswer}
      />
      <Pager
        questions={questions}
        current={current}
        setCurrent={setCurrent}
        answers={answers}
        flags={flags}
        corrects={corrects}
      />
    </div>
  )
}
