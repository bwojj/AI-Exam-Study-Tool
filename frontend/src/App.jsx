import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/Shell/AppShell'
import LibraryPage from './components/Library/LibraryPage'
import TestPage from './components/Test/TestPage'
import PracticePage from './components/Practice/PracticePage'
import AuthPage from './components/Auth/AuthPage'
import { getSession, clearSession } from './services/authStore'

export default function App() {
  const [authed, setAuthed] = useState(() => !!getSession())
  const [files, setFiles] = useState([])
  const [generateConfig, setGenerateConfig] = useState({
    count: 10,
    difficulty: 'Mixed',
    style: 'Multiple choice',
    name: '',
  })
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})             // { [questionId]: choiceIndex | string }
  const [shortAnswerResults, setShortAnswerResults] = useState({}) // { [questionId]: boolean }
  const [flags, setFlags] = useState({})                 // { [questionId]: boolean }
  const [current, setCurrent] = useState(0)
  const [finished, setFinished] = useState(false)
  const [testId, setTestId] = useState(null)
  const [corrects, setCorrects] = useState({})           // { [questionId]: boolean }
  const [reviewMode, setReviewMode] = useState(false)


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

  if (!authed) {
    return <AuthPage onAuthed={() => setAuthed(true)} />
  }

  return (
    <AppShell onLogout={() => { clearSession(); setAuthed(false) }}>
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
            <PracticePage
              setQuestions={setQuestions}
              resetTest={resetTest}
              setTestId={setTestId}
              setAnswers={setAnswers}
              setShortAnswerResults={setShortAnswerResults}
              setCorrects={setCorrects}
              setReviewMode={setReviewMode}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
