import type { Tool } from '../types'

type Props = {
  tool: Tool
  onToolChange: (tool: Tool) => void
  onClear: () => void
  onAddGraph: () => void
  graphVisible: boolean
}

export default function DigitalToolbar({ tool, onToolChange, onClear, onAddGraph, graphVisible }: Props) {
  return (
    <div className="digital-toolbar">
      {(['pen', 'eraser', 'line'] as Tool[]).map((item) => (
        <button key={item} className={tool === item ? 'active' : ''} onClick={() => onToolChange(item)}>
          {item[0].toUpperCase() + item.slice(1)}
        </button>
      ))}
      <button onClick={onAddGraph}>{graphVisible ? 'Remove graph' : 'Add graph'}</button>
      <button onClick={onClear}>Clear writing</button>
      <span>Hold Shift while drawing for a straight line.</span>
    </div>
  )
}
