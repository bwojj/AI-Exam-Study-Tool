import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import AppShell from './components/Shell/AppShell'
import LibraryPage from './components/Library/LibraryPage'
import TestPage from './components/Test/TestPage'
import PracticePage from './components/Practice/PracticePage'
import AuthPage from './components/Auth/AuthPage'
import { getSession, clearSession, isSessionValid } from './services/authStore'
import { buildQuestions } from './utils/buildQuestions'

export default function App() {
  const [authed, setAuthed] = useState(() => {
    if (!getSession()) return false
    if (!isSessionValid()) { clearSession(); return false }
    return true
  })
  const [files, setFiles] = useState([])
  const [generateConfig, setGenerateConfig] = useState({
    count: 10,
    difficulty: 'Mixed',
    style: 'Multiple choice',
    name: '',
  })
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [shortAnswerResults, setShortAnswerResults] = useState({})
  const [flags, setFlags] = useState({})
  const [current, setCurrent] = useState(0)
  const [finished, setFinished] = useState(false)
  const [testId, setTestId] = useState(null)
  const [corrects, setCorrects] = useState({})
  const [reviewMode, setReviewMode] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    function handleUnauthorized() {
      clearSession()
      setAuthed(false)
    }
    window.addEventListener('praxis:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('praxis:unauthorized', handleUnauthorized)
  }, [])

  function resetTest() {
    setAnswers({})
    setShortAnswerResults({})
    setFlags({})
    setCurrent(0)
    setFinished(false)
    setTestId(null)
    setCorrects({})
    setReviewMode(false)
  }

  function onSelectTest(test) {
    const qs = buildQuestions(test)
    resetTest()
    const newAnswers = {}
    const newSAResults = {}
    const newCorrects = {}
    test.userAnswers?.forEach(ua => {
      const qId = String(ua.question_num)
      const qType = test.type?.[ua.question_num]
      newAnswers[qId] = qType === 'short answer' ? ua.answer : Number(ua.answer)
      if (qType === 'short answer') newSAResults[qId] = ua.correct
      newCorrects[qId] = ua.correct
    })
    setTestId(test.id)
    setAnswers(newAnswers)
    setShortAnswerResults(newSAResults)
    setCorrects(newCorrects)
    setReviewMode(true)
    setQuestions(qs)
    navigate('/test')
  }

  if (!authed) {
    return <AuthPage onAuthed={() => setAuthed(true)} />
  }

  return (
    <AppShell onLogout={() => { clearSession(); setAuthed(false) }} onSelectTest={onSelectTest}>
      <Routes>
        <Route
          path="/"
          element={
            <LibraryPage
              files={files}
              setFiles={setFiles}
              generateConfig={generateConfig}
              setGenerateConfig={setGenerateConfig}
              setQuestions={setQuestions}
              questions={questions}
              resetTest={resetTest}
              setTestId={setTestId}
            />
          }
        />
        <Route
          path="/test"
          element={
            <TestPage
              questions={questions}
              answers={answers}
              setAnswers={setAnswers}
              shortAnswerResults={shortAnswerResults}
              setShortAnswerResults={setShortAnswerResults}
              flags={flags}
              setFlags={setFlags}
              current={current}
              setCurrent={setCurrent}
              finished={finished}
              setFinished={setFinished}
              resetTest={resetTest}
              testId={testId}
              corrects={corrects}
              setCorrects={setCorrects}
              reviewMode={reviewMode}
            />
          }
        />
        <Route
          path="/practice"
          element={
            <PracticePage onSelectTest={onSelectTest} />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
