import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/Shell/AppShell'
import LibraryPage from './components/Library/LibraryPage'
import TestPage from './components/Test/TestPage'
import PracticePage from './components/Practice/PracticePage'
import AuthPage from './components/Auth/AuthPage'
import { getSession } from './services/authStore'

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
  const [answers, setAnswers] = useState({})   // { [questionId]: choiceIndex }
  const [flags, setFlags] = useState({})        // { [questionId]: boolean }
  const [current, setCurrent] = useState(0)
  const [finished, setFinished] = useState(false)

  function resetTest() {
    setAnswers({})
    setFlags({})
    setCurrent(0)
    setFinished(false)
  }

  if (!authed) {
    return <AuthPage onAuthed={() => setAuthed(true)} />
  }

  return (
    <AppShell>
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
              flags={flags}
              setFlags={setFlags}
              current={current}
              setCurrent={setCurrent}
              finished={finished}
              setFinished={setFinished}
              resetTest={resetTest}
            />
          }
        />
        <Route
          path="/practice"
          element={
            <PracticePage
              setQuestions={setQuestions}
              resetTest={resetTest}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
