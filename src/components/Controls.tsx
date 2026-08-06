import type { Difficulty, WorksheetSettings, WorkspaceMode } from '../types'

type Props = {
  settings: WorksheetSettings
  mode: WorkspaceMode
  showHints: boolean
  showDetailedSolutions: boolean
  showAnswerKey: boolean
  onChange: (next: WorksheetSettings) => void
  onModeChange: (mode: WorkspaceMode) => void
  onRegenerate: () => void
  onToggleHints: () => void
  onToggleDetailedSolutions: () => void
  onToggleAnswerKey: () => void
}

export default function Controls({ settings, mode, showHints, showDetailedSolutions, showAnswerKey, onChange, onModeChange, onRegenerate, onToggleHints, onToggleDetailedSolutions, onToggleAnswerKey }: Props) {
  const set = <K extends keyof WorksheetSettings>(key: K, value: WorksheetSettings[K]) => onChange({ ...settings, [key]: value })

  return (
    <aside className="controls">
      <div>
        <p className="eyebrow">Tutor Hub</p>
        <h1>Worksheet Studio</h1>
        <p className="muted">Generate targeted practice, offer four-choice hints, and switch between print and digital work.</p>
      </div>

      <div className="segmented" aria-label="Worksheet mode">
        <button className={mode === 'print' ? 'active' : ''} onClick={() => onModeChange('print')}>Print</button>
        <button className={mode === 'digital' ? 'active' : ''} onClick={() => onModeChange('digital')}>Digital</button>
      </div>

      <label>Worksheet title<input value={settings.title} onChange={(event) => set('title', event.target.value)} /></label>
      <label>Student name<input value={settings.studentName} onChange={(event) => set('studentName', event.target.value)} placeholder="Optional" /></label>
      <label>Topic<select value={settings.topic} onChange={(event) => set('topic', event.target.value as WorksheetSettings['topic'])}><option value="fractions">Operations with fractions</option><option value="exponents">Laws of exponents</option></select></label>
      <label>Grade<select value={settings.grade} onChange={(event) => set('grade', Number(event.target.value))}>{[6,7,8,9].map((grade) => <option key={grade} value={grade}>Grade {grade}</option>)}</select></label>

      <div className="difficulty-grid">
        <label>Minimum difficulty<select value={settings.minDifficulty} onChange={(event) => set('minDifficulty', Number(event.target.value) as Difficulty)}>{[1,2,3,4,5].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <label>Maximum difficulty<select value={settings.maxDifficulty} onChange={(event) => set('maxDifficulty', Number(event.target.value) as Difficulty)}>{[1,2,3,4,5].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
      </div>

      <label>Number of questions<input type="range" min="1" max="4" value={settings.questionCount} onChange={(event) => set('questionCount', Number(event.target.value))} /><span>{settings.questionCount}</span></label>
      <label className="checkbox-row"><input type="checkbox" checked={settings.showSkillLabels} onChange={(event) => set('showSkillLabels', event.target.checked)} />Show skill labels</label>

      <div className="button-stack">
        <button onClick={onRegenerate}>Generate worksheet</button>
        <button className="secondary" onClick={onToggleHints}>{showHints ? 'Hide hints' : 'Show four-choice hints'}</button>
        <button className="secondary" onClick={onToggleDetailedSolutions}>{showDetailedSolutions ? 'Hide detailed solutions' : 'Show detailed solutions'}</button>
        <button className="secondary" onClick={onToggleAnswerKey}>{showAnswerKey ? 'Hide answer key' : 'Show simple answer key'}</button>
        <button className="secondary" onClick={() => window.print()}>Print / Save as PDF</button>
      </div>
    </aside>
  )
}
