// Upload Hub page

function formatBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
  if (b < 1024 * 1024 * 1024) return (b / 1024 / 1024).toFixed(1) + ' MB';
  return (b / 1024 / 1024 / 1024).toFixed(2) + ' GB';
}

function inferType(name) {
  const ext = name.split('.').pop().toUpperCase();
  return ['PDF', 'DOCX', 'TXT', 'MD', 'PPTX', 'CSV'].includes(ext) ? ext : 'FILE';
}

function UploadPage({ files, setFiles, onGenerate, generateConfig, setGenerateConfig }) {
  const [over, setOver] = React.useState(false);
  const fileInputRef = React.useRef(null);

  // Promote any "processing" / "queued" files toward "analyzed" over time
  React.useEffect(() => {
    const id = setInterval(() => {
      setFiles((prev) => {
        let changed = false;
        const out = prev.map((f) => {
          if (f.status === 'processing') { changed = true; return { ...f, status: 'analyzed' }; }
          if (f.status === 'queued') { changed = true; return { ...f, status: 'processing' }; }
          return f;
        });
        return changed ? out : prev;
      });
    }, 5500);
    return () => clearInterval(id);
  }, [setFiles]);

  const handleFiles = (fileList) => {
    const now = new Date();
    const stamp = now.toISOString().slice(0, 16).replace('T', ' ');
    const added = Array.from(fileList).map((f) => ({
      name: f.name,
      size: formatBytes(f.size),
      type: inferType(f.name),
      status: 'queued',
      timestamp: stamp,
    }));
    setFiles((prev) => [...added, ...prev]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const analyzedCount = files.filter((f) => f.status === 'analyzed').length;

  return (
    <div className="scroller" data-screen-label="upload-hub">
      <div className="upload-hero">
        <h1>Upload your study materials</h1>
        <p className="lede">
          Drop your notes, slides, textbooks, or past exams. Praxis reads the
          source and generates a practice test with worked explanations.
        </p>
        <div className="formats">Supported: PDF, DOCX, TXT, MD, PPTX</div>
      </div>

      <div className="panel dropzone">
        <div
          className={`dropzone-inner ${over ? 'is-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={onDrop}
        >
          <div className="dropzone-icon"><Icon.Cloud /></div>
          <div className="dropzone-title">Drop files to upload</div>
          <div className="dropzone-sub">
            Drag and drop, or{' '}
            <span className="link" onClick={() => fileInputRef.current?.click()}>browse your computer</span>
          </div>
          <div className="dz-actions">
            <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>
              Select files
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </div>

      {/* Generate strip */}
      <div className="generate-strip">
        <div className="info">
          <div className="l"><Icon.Sparkles /> &nbsp; Practice test</div>
          <h3>Generate a test from your materials</h3>
          <p>{analyzedCount} file{analyzedCount === 1 ? '' : 's'} ready. Takes about 8 seconds.</p>
        </div>
        <div className="controls">
          <div className="mini-control">
            <div className="l">Questions</div>
            <select
              value={generateConfig.count}
              onChange={(e) => setGenerateConfig({ ...generateConfig, count: Number(e.target.value) })}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={40}>40</option>
              <option value={60}>60</option>
            </select>
          </div>
          <div className="mini-control">
            <div className="l">Difficulty</div>
            <select
              value={generateConfig.difficulty}
              onChange={(e) => setGenerateConfig({ ...generateConfig, difficulty: e.target.value })}
            >
              <option>Mixed</option>
              <option>Foundational</option>
              <option>Advanced</option>
              <option>Exam-grade</option>
            </select>
          </div>
          <div className="mini-control">
            <div className="l">Style</div>
            <select
              value={generateConfig.style}
              onChange={(e) => setGenerateConfig({ ...generateConfig, style: e.target.value })}
            >
              <option>Multiple choice</option>
              <option>Short answer</option>
              <option>Mixed format</option>
            </select>
          </div>
          <button
            className="btn btn-primary"
            disabled={analyzedCount === 0}
            onClick={onGenerate}
          >
            Generate test →
          </button>
        </div>
      </div>

      {/* Recent files table */}
      <div className="panel files-panel">
        <div className="files-head">
          <div className="t">Recent uploads</div>
          <div className="tools">
            <button className="tool-btn" title="Filter"><Icon.Filter /></button>
            <button className="tool-btn" title="Refresh"><Icon.Refresh /></button>
          </div>
        </div>
        {files.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            No files yet — drop materials above to get started.
          </div>
        ) : (
          <table className="files">
            <thead>
              <tr>
                <th>Filename</th>
                <th style={{ width: '110px' }}>Size</th>
                <th style={{ width: '90px' }}>Type</th>
                <th style={{ width: '160px' }}>Status</th>
                <th style={{ width: '180px' }}>Timestamp</th>
                <th style={{ width: '60px' }}></th>
              </tr>
            </thead>
            <tbody>
              {files.map((f, i) => (
                <tr key={i}>
                  <td>
                    <div className="file-cell">
                      <span className="ico"><Icon.File /></span>
                      <span>{f.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--ink-2)' }}>{f.size}</td>
                  <td><span className="tag">{f.type}</span></td>
                  <td>
                    <span className={`status-pill ${f.status}`}>
                      <span className="d" />
                      {f.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{f.timestamp}</td>
                  <td>
                    <div className="row-actions">
                      <button className="menu-btn"><Icon.More /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

window.UploadPage = UploadPage;
