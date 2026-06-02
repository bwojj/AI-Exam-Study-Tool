// Main app — routing + state container + Tweaks panel

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "cyan",
  "density": "regular",
  "showProgress": true
}/*EDITMODE-END*/;

const ACCENT_PRESETS = {
  cyan:   { hue: 200, label: 'Cyan' },
  violet: { hue: 290, label: 'Violet' },
  lime:   { hue: 130, label: 'Lime' },
  amber:  { hue: 70,  label: 'Amber' },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = React.useState('upload');
  const [files, setFiles] = React.useState(window.PRAXIS_DATA.files);
  const [generateConfig, setGenerateConfig] = React.useState({
    count: 40, difficulty: 'Mixed', style: 'Multiple choice'
  });

  // Test state
  const [answers, setAnswers] = React.useState({});
  const [flags, setFlags] = React.useState({});
  const [current, setCurrent] = React.useState(0);
  const [finished, setFinished] = React.useState(false);

  // Apply accent tweak to CSS vars
  React.useEffect(() => {
    const root = document.documentElement;
    const hue = ACCENT_PRESETS[t.accent]?.hue ?? 200;
    root.style.setProperty('--accent',       `oklch(80% 0.115 ${hue})`);
    root.style.setProperty('--accent-2',     `oklch(72% 0.115 ${hue})`);
    root.style.setProperty('--accent-soft',  `oklch(80% 0.115 ${hue} / 0.12)`);
    root.style.setProperty('--accent-glow',  `oklch(80% 0.115 ${hue} / 0.18)`);
  }, [t.accent]);

  // Apply density
  React.useEffect(() => {
    const root = document.documentElement;
    if (t.density === 'compact') {
      root.style.setProperty('--r-md', '8px');
      root.style.setProperty('--r-lg', '10px');
    } else if (t.density === 'comfy') {
      root.style.setProperty('--r-md', '12px');
      root.style.setProperty('--r-lg', '16px');
    } else {
      root.style.removeProperty('--r-md');
      root.style.removeProperty('--r-lg');
    }
  }, [t.density]);

  const onGenerate = () => {
    // Reset test state, jump to test
    setAnswers({});
    setFlags({});
    setCurrent(0);
    setFinished(false);
    setRoute('test');
  };

  const onReset = () => {
    setAnswers({});
    setFlags({});
    setCurrent(0);
    setFinished(false);
    setRoute('upload');
  };

  // Sidebar progress
  const total = window.PRAXIS_DATA.test.questions.length;
  const answered = Object.keys(answers).length;
  const correctSoFar = window.PRAXIS_DATA.test.questions
    .filter((q) => answers[q.id] === q.correct).length;
  const accuracy = answered > 0
    ? Math.round((correctSoFar / answered) * 100) + '%'
    : '—';
  const completionTxt = `${answered}/${total}`;
  const completionPct = (answered / total) * 100;

  return (
    <div className="app">
      <Sidebar
        route={route}
        setRoute={setRoute}
        accuracy={accuracy}
        completionTxt={completionTxt}
        completionPct={completionPct}
      />

      <main className="main">
        {route === 'upload' ? (
          <>
            <Topbar title="Library" hasNotif />
            <UploadPage
              files={files}
              setFiles={setFiles}
              onGenerate={onGenerate}
              generateConfig={generateConfig}
              setGenerateConfig={setGenerateConfig}
            />
          </>
        ) : (
          <>
            <Topbar title="Practice test" />
            <TestPage
              answers={answers} setAnswers={setAnswers}
              flags={flags} setFlags={setFlags}
              current={current} setCurrent={setCurrent}
              finished={finished} setFinished={setFinished}
              onReset={onReset}
            />
          </>
        )}
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakRadio
          label="Accent"
          value={t.accent}
          options={[
            { value: 'cyan',   label: 'Cyan' },
            { value: 'violet', label: 'Violet' },
            { value: 'lime',   label: 'Lime' },
            { value: 'amber',  label: 'Amber' },
          ]}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakRadio
          label="Density"
          value={t.density}
          options={['compact', 'regular', 'comfy']}
          onChange={(v) => setTweak('density', v)}
        />
        <TweakSection label="Navigation" />
        <TweakRadio
          label="Page"
          value={route}
          options={[{ value: 'upload', label: 'Upload' }, { value: 'test', label: 'Test' }]}
          onChange={setRoute}
        />
        <TweakButton label="Reset test progress" secondary onClick={onReset} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
