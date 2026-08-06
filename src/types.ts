export type TopicId = 'fractions' | 'exponents'
export type Difficulty = 1 | 2 | 3 | 4 | 5
export type WorkspaceMode = 'print' | 'digital'
export type Tool = 'pen' | 'eraser' | 'line'

export type Choice = {
  id: string
  value: string
}

export type SolutionStep = {
  title: string
  body: string
  math?: string
}

export type Question = {
  id: string
  topic: TopicId
  grade: number
  difficulty: Difficulty
  skill: string
  curriculum: string[]
  prompt: string
  finalAnswer: string
  choices: Choice[]
  correctChoiceId: string
  solutionSteps: SolutionStep[]
}

export type WorksheetSettings = {
  title: string
  studentName: string
  topic: TopicId
  grade: number
  minDifficulty: Difficulty
  maxDifficulty: Difficulty
  questionCount: number
  showSkillLabels: boolean
}

export type Point = { x: number; y: number }

export type DrawingStroke = {
  id: string
  tool: 'pen' | 'line'
  points: Point[]
  width: number
}
