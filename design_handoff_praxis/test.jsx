// Practice Test page

function TestPage({ answers, setAnswers, flags, setFlags, current, setCurrent, finished, setFinished, onReset }) {
  const data = window.PRAXIS_DATA.test;
  const questions = data.questions;
  const total = questions.length;
  const q = questions[current];

  const [justification, setJustification] = React.useState('');
  const [submittedThisQ, setSubmittedThisQ] = React.useState(false);

  // Reset per-question composer state on navigation
  React.useEffect(() => {
    setJustification('');
    setSubmittedThisQ(answers[q.id] !== undefined);
  }, [current, q.id, answers]);

  const selected = answers[q.id];
  const isFlagged = !!flags[q.id];
  const isCorrect = selected !== undefined && selected === q.correct;

  const onPick = (idx) => {
    if (submittedThisQ) return;
    setAnswers({ ...answers, [q.id]: idx });
  };

  const onSubmit = () => {
    if (selected === undefined) return;
    setSubmittedThisQ(true);
  };

  const onFlag = () => {
    setFlags({ ...flags, [q.id]: !isFlagged });
  };

  const goNext = () => {
    if (current < total - 1) setCurrent(current + 1);
    else setFinished(true);
  };
  const goPrev = () => { if (current > 0) setCurrent(current - 1); };

  if (finished) {
    return <FinishScreen answers={answers} questions={questions} onReset={onReset} onReview={() => { setFinished(false); setCurrent(0); }} />;
  }

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="scroller" data-screen-label="practice-test">
      {/* Test status bar */}
      <div className="test-bar">
        <div className="meta">
          <div>
            <div className="l">Question</div>
            <div className="v">{current + 1} of {total}</div>
          </div>
          <div className="divider-v" />
          <div>
            <div className="l">Topic</div>
            <div className="v" style={{ fontSize: 14 }}>{q.topic}</div>
          </div>
          <div className="divider-v" />
          <div>
            <div className="l">Answered</div>
            <div className="v">{answeredCount} of {total}</div>
          </div>
        </div>
        <button className={`review-btn ${isFlagged ? 'is-flagged' : ''}`} onClick={onFlag}>
          <Icon.Flag /> {isFlagged ? 'Flagged' : 'Mark for review'}
        </button>
      </div>

      <div className="panel qcard">
        <div className="module-tag">Question {q.id} · {q.topic}</div>
        <h2 className="qtitle">{q.title}</h2>
        <div className="qbody">
          {q.body.map((p, i) => <p key={i}>{p}</p>)}
          {q.code && (
            <div className="code-block"><span className="dim">{`>`}</span> {q.code}</div>
          )}
        </div>

        <div className="choices">
          {q.choices.map((c, i) => {
            const letter = String.fromCharCode(65 + i);
            const isPicked = selected === i;
            let cls = 'choice';
            if (submittedThisQ) {
              if (i === q.correct) cls += ' is-correct';
              else if (isPicked) cls += ' is-incorrect';
            } else if (isPicked) cls += ' is-selected';
            return (
              <button key={i} className={cls} onClick={() => onPick(i)}>
                <span className="letter">{letter}</span>
                <span>{c}</span>
              </button>
            );
          })}
        </div>

        {submittedThisQ && (
          <div className="explain">
            <div className="h">
              <Icon.Sparkles />
              Explanation
              <span className={`verdict ${isCorrect ? 'ok' : 'no'}`}>
                {isCorrect ? <><Icon.Check /> Correct</> : <><Icon.X /> Review</>}
              </span>
            </div>
            <p>{q.explanation}</p>
          </div>
        )}

        {/* Composer */}
        <div className="composer">
          <span className="prefix">{`>`}</span>
          <input
            type="text"
            placeholder={submittedThisQ ? "Continue to the next question →" : "Type a justification or notes…"}
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            disabled={submittedThisQ}
          />
          {submittedThisQ ? (
            <button className="submit" onClick={goNext}>
              {current < total - 1 ? 'Next →' : 'Finish'}
            </button>
          ) : (
            <button className="submit" disabled={selected === undefined} onClick={onSubmit}>
              Submit Answer
            </button>
          )}
          <button className="skip" onClick={goNext} title="Skip without answering">
            <Icon.ArrowRight />
          </button>
        </div>

        {/* Foot */}
        <div className="qfoot">
          <div className="ln" />
          <div className="nav">
            <button onClick={goPrev} disabled={current === 0} aria-label="Previous"><Icon.ArrowLeft /></button>
            <button onClick={goNext} aria-label="Next"><Icon.ArrowRight /></button>
          </div>
        </div>
      </div>

      {/* Question pager */}
      <div className="pager">
        <div className="lbl">Questions</div>
        <div className="pills">
          {questions.map((qq, i) => {
            const answered = answers[qq.id] !== undefined;
            const flag = !!flags[qq.id];
            let cls = 'pill';
            if (i === current) cls += ' current';
            else if (answered) cls += ' answered';
            if (flag) cls += ' flagged';
            return (
              <button key={qq.id} className={cls} onClick={() => setCurrent(i)}>
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FinishScreen({ answers, questions, onReset, onReview }) {
  const correct = questions.filter((q) => answers[q.id] === q.correct).length;
  const pct = Math.round((correct / questions.length) * 100);
  const incorrect = Object.keys(answers).length - correct;
  const skipped = questions.length - Object.keys(answers).length;

  return (
    <div className="scroller" data-screen-label="test-finished">
      <div className="panel finish">
        <div className="score">{pct}%</div>
        <h2>Session complete</h2>
        <p>
          You answered {correct} of {questions.length} questions correctly. A detailed
          breakdown is available in the Review tab — each missed item links back to
          the source passage.
        </p>
        <div className="stat-grid">
          <div className="stat">
            <div className="k">Correct</div>
            <div className="v" style={{ color: 'var(--good)' }}>{correct}</div>
          </div>
          <div className="stat">
            <div className="k">Incorrect</div>
            <div className="v" style={{ color: 'var(--danger)' }}>{incorrect}</div>
          </div>
          <div className="stat">
            <div className="k">Skipped</div>
            <div className="v" style={{ color: 'var(--muted)' }}>{skipped}</div>
          </div>
        </div>
        <div className="actions">
          <button className="btn btn-ghost" onClick={onReview}>Review Answers</button>
          <button className="btn btn-primary" onClick={onReset}>New Session →</button>
        </div>
      </div>
    </div>
  );
}

window.TestPage = TestPage;
