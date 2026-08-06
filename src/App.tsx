import { useMemo, useState } from 'react'
import Controls from './components/Controls'
import DigitalToolbar from './components/DigitalToolbar'
import Worksheet from './components/Worksheet'
import { questionBank } from './data/questions'
import type { Question, Tool, WorksheetSettings, WorkspaceMode } from './types'

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]]
  }
  return copy
}

export default function App() {
  const [settings, setSettings] = useState<WorksheetSettings>({
    title: 'Targeted Math Practice',
    studentName: '',
    topic: 'fractions',
    grade: 7,
    minDifficulty: 1,
    maxDifficulty: 3,
    questionCount: 4,
    showSkillLabels: true,
  })
  const [mode, setMode] = useState<WorkspaceMode>('print')
  const [seed, setSeed] = useState(0)
  const [showHints, setShowHints] = useState(false)
  const [showDetailedSolutions, setShowDetailedSolutions] = useState(false)
  const [showAnswerKey, setShowAnswerKey] = useState(false)
  const [tool, setTool] = useState<Tool>('pen')
  const [clearSignal, setClearSignal] = useState(0)
  const [graphVisible, setGraphVisible] = useState(false)

  const questions = useMemo<Question[]>(() => {
    const exactMatches = questionBank.filter((question) =>
      question.topic === settings.topic &&
      question.grade === settings.grade &&
      question.difficulty >= settings.minDifficulty &&
      question.difficulty <= settings.maxDifficulty,
    )

    const fallbackMatches = questionBank.filter((question) =>
      question.topic === settings.topic &&
      question.difficulty >= settings.minDifficulty &&
      question.difficulty <= settings.maxDifficulty,
    )

    const pool = exactMatches.length > 0 ? exactMatches : fallbackMatches
    return shuffle(pool).slice(0, Math.min(settings.questionCount, pool.length))
  }, [settings.topic, settings.grade, settings.minDifficulty, settings.maxDifficulty, settings.questionCount, seed])

  return (
    <div className="app-shell">
      <Controls
        settings={settings}
        mode={mode}
        showHints={showHints}
        showDetailedSolutions={showDetailedSolutions}
        showAnswerKey={showAnswerKey}
        onChange={setSettings}
        onModeChange={setMode}
        onRegenerate={() => setSeed((value) => value + 1)}
        onToggleHints={() => setShowHints((value) => !value)}
        onToggleDetailedSolutions={() => setShowDetailedSolutions((value) => !value)}
        onToggleAnswerKey={() => setShowAnswerKey((value) => !value)}
      />

      <section className="workspace">
        {mode === 'digital' && (
          <DigitalToolbar
            tool={tool}
            onToolChange={setTool}
            onClear={() => setClearSignal((value) => value + 1)}
            onAddGraph={() => setGraphVisible((value) => !value)}
            graphVisible={graphVisible}
          />
        )}

        <Worksheet
          questions={questions}
          settings={settings}
          mode={mode}
          showHints={showHints}
          showDetailedSolutions={showDetailedSolutions}
          showAnswerKey={showAnswerKey}
          tool={tool}
          clearSignal={clearSignal}
          graphVisible={graphVisible}
        />
      </section>
    </div>
  )
}
