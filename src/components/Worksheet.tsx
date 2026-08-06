import { BlockMath, InlineMath } from 'react-katex'
import type { Question, Tool, WorksheetSettings, WorkspaceMode } from '../types'
import DrawingLayer from './DrawingLayer'
import GraphPaper from './GraphPaper'

type Props = {
  questions: Question[]
  settings: WorksheetSettings
  mode: WorkspaceMode
  showHints: boolean
  showDetailedSolutions: boolean
  showAnswerKey: boolean
  tool: Tool
  clearSignal: number
  graphVisible: boolean
}

export default function Worksheet({ questions, settings, mode, showHints, showDetailedSolutions, showAnswerKey, tool, clearSignal, graphVisible }: Props) {
  return (
    <main className="preview-area">
      <section className={`paper worksheet-paper ${mode === 'digital' ? 'digital-paper' : ''}`}>
        <header className="worksheet-header">
          <div>
            <p className="eyebrow dark">Practice worksheet</p>
            <h2>{settings.title}</h2>
          </div>
          <div className="student-fields">
            <span>Name: {settings.studentName || '____________________'}</span>
            <span>Date: ____________________</span>
          </div>
        </header>

        <div className="worksheet-meta">
          <span>Grade {settings.grade}</span>
          <span>Difficulty {settings.minDifficulty}–{settings.maxDifficulty}</span>
          <span>{questions.length} questions</span>
        </div>

        <div className="question-grid">
          {questions.map((question, index) => (
            <article className="question-card" key={question.id}>
              <div className="question-card-header">
                <strong>{index + 1}.</strong>
                {settings.showSkillLabels && <span>{question.skill}</span>}
              </div>
              <BlockMath math={question.prompt} />

              {showHints && (
                <div className="hint-box">
                  <strong>Hint: Which answer could be correct?</strong>
                  <div className="choice-grid">
                    {question.choices.map((choice) => (
                      <label key={choice.id}>
                        <input type="radio" name={`choice-${question.id}`} />
                        <span>{choice.id.toUpperCase()}.</span>
                        <InlineMath math={choice.value} />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="work-lines"><span /><span /><span /></div>
            </article>
          ))}
        </div>

        {graphVisible && <GraphPaper />}
        {mode === 'digital' && <DrawingLayer tool={tool} clearSignal={clearSignal} />}
      </section>

      {showAnswerKey && (
        <section className="paper answer-key">
          <header className="worksheet-header"><div><p className="eyebrow dark">Teacher copy</p><h2>Simple Answer Key</h2></div></header>
          <ol className="simple-answer-list">
            {questions.map((question) => <li key={question.id}><InlineMath math={question.finalAnswer} /></li>)}
          </ol>
        </section>
      )}

      {showDetailedSolutions && (
        <section className="paper solutions">
          <header className="worksheet-header"><div><p className="eyebrow dark">Worked solutions</p><h2>Detailed Solutions</h2></div></header>
          <div className="solution-list">
            {questions.map((question, index) => (
              <article key={question.id}>
                <h3>Question {index + 1}</h3>
                <BlockMath math={question.prompt} />
                <ol>
                  {question.solutionSteps.map((step) => (
                    <li key={step.title}>
                      <strong>{step.title}</strong>
                      <p>{step.body}</p>
                      {step.math && <BlockMath math={step.math} />}
                    </li>
                  ))}
                </ol>
                <div className="final-answer">Final answer: <InlineMath math={question.finalAnswer} /></div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
