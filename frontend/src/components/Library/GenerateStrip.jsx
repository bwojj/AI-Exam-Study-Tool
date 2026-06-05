import { useNavigate } from 'react-router-dom'
import { Icon } from '../Icons'
import { getReviewGuide } from '../../services/api'

export default function GenerateStrip({ files, generateConfig, setGenerateConfig, setQuestions, resetTest, formData }) {
  const navigate = useNavigate()
  const analyzedCount = files.filter((f) => f.status === 'analyzed').length
  const isEnabled = files.filter((f) => f.status !== 'error').length > 0

  async function handleGenerate() {
    if (!isEnabled) return
    resetTest()

    if (formData){
      formData.append("type", generateConfig.style); 
      formData.append("questions", generateConfig.count); ;
    }
    // gets question and answer data
    const data = await getReviewGuide(formData); 
    console.log(data); 

    
    Object.entries(data.questions).forEach(([key, value]) => {
      setQuestions((prev) =>
        [...prev, {
          id: key, 
          question: value, 
          choices: data.options[key], 
          correctIndex: data.answers[key], 
          body: data.body[key], 
          explanation: data.explanation[key], 
          topic: data.topic[key],
          containsMarkdown: data.containsMarkdown[key], 
        }] 
      ) 
    })

    /* setQuestions([
      {
        id: 1,
        topic: 'Neural Networks',
        question: 'What is backpropagation?',
        body: 'Select the most accurate description of the backpropagation algorithm.',
        choices: [
          'A method for initializing weights',
          'An algorithm for computing gradients via chain rule',
          'A regularization technique',
          'A type of activation function',
        ],
        correctIndex: 1,
        explanation:
          'Backpropagation computes gradients of the loss with respect to each weight by applying the chain rule of calculus, propagating error signals backward through the network.',
      },
      {
        id: 2,
        topic: 'Activation Functions',
        question: 'Which activation function suffers from the vanishing gradient problem?',
        body: 'Consider deep networks trained with gradient descent.',
        choices: ['ReLU', 'Leaky ReLU', 'Sigmoid', 'ELU'],
        correctIndex: 2,
        explanation:
          'Sigmoid saturates at both ends, squashing gradients to near-zero and making it difficult to train deep networks.',
      },
      {
        id: 3,
        topic: 'Optimization',
        question: 'What does momentum in SGD help with?',
        body: null,
        choices: [
          'Reduces overfitting',
          'Accelerates convergence in relevant directions',
          'Increases learning rate adaptively',
          'Prevents exploding gradients',
        ],
        correctIndex: 1,
        explanation:
          'Momentum accumulates a velocity vector in directions of persistent gradient, helping to navigate ravines and reduce oscillations.',
      },
    ]) */ 
    navigate('/test')
  }

  return (
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
  )
}
