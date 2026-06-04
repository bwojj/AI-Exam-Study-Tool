import Dropzone from './Dropzone'
import GenerateStrip from './GenerateStrip'
import UploadsTable from './UploadsTable'
import { useState } from 'react';

export default function LibraryPage({
  files,
  setFiles,
  generateConfig,
  setGenerateConfig,
  questions,
  setQuestions,
  resetTest,
}) {
  const [formData, setFormData] = useState();

  async function uploadFile(file) {
    const data = new FormData();
    data.append('file', file);
    setFormData(data); 
  }

  function handleAddFiles(fileList) {
    const newEntries = Array.from(fileList).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type || file.name.split('.').pop(),
      status: 'queued',
      timestamp: new Date(),
    }))
    setFiles((prev) => [...prev, ...newEntries])
    Array.from(fileList).forEach((file, i) => uploadFile(file, newEntries[i].id))
  }

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

        {/* Dropzone — hidden once files exist */}
        {files.length === 0 && (
          <div style={{ marginBottom: '18px' }}>
            <Dropzone onAddFiles={handleAddFiles} />
          </div>
        )}

        {/* Uploads table — replaces dropzone once files are added */}
        {files.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <UploadsTable files={files} setFiles={setFiles} onAddFiles={handleAddFiles} />
          </div>
        )}

        {/* Generate strip */}
        <div style={{ marginBottom: '18px' }}>
          <GenerateStrip
            files={files}
            generateConfig={generateConfig}
            setGenerateConfig={setGenerateConfig}
            setQuestions={setQuestions}
            questions={questions}
            resetTest={resetTest}
            formData={formData}
          />
        </div>
      </div>
    </div>
  )
}
