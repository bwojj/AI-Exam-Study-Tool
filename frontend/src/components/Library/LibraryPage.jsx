import Dropzone from './Dropzone'
import GenerateStrip from './GenerateStrip'
import UploadsTable from './UploadsTable'

export default function LibraryPage({
  files,
  setFiles,
  generateConfig,
  setGenerateConfig,
  setQuestions,
  resetTest,
}) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px 40px 80px',
        position: 'relative',
      }}
    >
      {/* Decorative glow — top right */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '600px',
          background: 'radial-gradient(ellipse at top right, var(--accent-soft), transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero section */}
        <div style={{ marginBottom: '22px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 600,
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              color: 'var(--ink)',
              margin: 0,
            }}
          >
            Upload your study materials
          </h1>

          <p
            style={{
              fontSize: '14.5px',
              color: 'var(--ink-2)',
              maxWidth: '680px',
              lineHeight: 1.55,
              marginTop: '10px',
              marginBottom: 0,
            }}
          >
            Upload your class notes, textbooks, or past exams. Praxis will analyze them and
            generate exam-style questions tailored to your material.
          </p>

          <p
            style={{
              fontSize: '12.5px',
              color: 'var(--muted)',
              marginTop: '6px',
              marginBottom: 0,
            }}
          >
            Supported: PDF, DOCX, TXT, MD, PPTX
          </p>
        </div>

        {/* Dropzone */}
        <div style={{ marginBottom: '18px' }}>
          <Dropzone files={files} setFiles={setFiles} />
        </div>

        {/* Generate strip */}
        <div style={{ marginBottom: '18px' }}>
          <GenerateStrip
            files={files}
            generateConfig={generateConfig}
            setGenerateConfig={setGenerateConfig}
            setQuestions={setQuestions}
            resetTest={resetTest}
          />
        </div>

        {/* Uploads table */}
        <UploadsTable files={files} setFiles={setFiles} />
      </div>
    </div>
  )
}
