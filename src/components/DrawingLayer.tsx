import { useEffect, useState } from 'react'
import { getStroke } from 'perfect-freehand'
import type { DrawingStroke, Point, Tool } from '../types'

type Props = { tool: Tool; clearSignal: number }

function getSvgPath(points: number[][]): string {
  if (points.length < 2) return ''
  const average = (a: number[], b: number[]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  let path = `M ${points[0][0]} ${points[0][1]} Q`
  for (let index = 1; index < points.length - 1; index += 1) {
    const midpoint = average(points[index], points[index + 1])
    path += ` ${points[index][0]} ${points[index][1]} ${midpoint[0]} ${midpoint[1]}`
  }
  return `${path} Z`
}

export default function DrawingLayer({ tool, clearSignal }: Props) {
  const [strokes, setStrokes] = useState<DrawingStroke[]>([])
  const [current, setCurrent] = useState<DrawingStroke | null>(null)

  useEffect(() => { setStrokes([]); setCurrent(null) }, [clearSignal])

  const pointFromEvent = (event: React.PointerEvent<SVGSVGElement>): Point => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
  }

  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    const start = pointFromEvent(event)

    if (tool === 'eraser') {
      const nearest = [...strokes].reverse().find((stroke) => stroke.points.some((point) => Math.hypot(point.x - start.x, point.y - start.y) < 20))
      if (nearest) setStrokes((items) => items.filter((item) => item.id !== nearest.id))
      return
    }

    setCurrent({
      id: crypto.randomUUID(),
      tool: tool === 'line' || event.shiftKey ? 'line' : 'pen',
      points: [start],
      width: 3,
    })
  }

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!current || tool === 'eraser') return
    const nextPoint = pointFromEvent(event)
    setCurrent((stroke) => {
      if (!stroke) return stroke
      return stroke.tool === 'line'
        ? { ...stroke, points: [stroke.points[0], nextPoint] }
        : { ...stroke, points: [...stroke.points, nextPoint] }
    })
  }

  const handlePointerUp = () => {
    if (!current) return
    setStrokes((items) => [...items, current])
    setCurrent(null)
  }

  const visibleStrokes = current ? [...strokes, current] : strokes

  return (
    <svg className={`drawing-layer tool-${tool}`} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
      {visibleStrokes.map((stroke) => {
        if (stroke.tool === 'line') {
          const [start, end = start] = stroke.points
          return <line key={stroke.id} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="currentColor" strokeWidth={stroke.width} strokeLinecap="round" />
        }
        const outline = getStroke(stroke.points.map((point) => [point.x, point.y]), { size: stroke.width * 2.4, thinning: 0.6, smoothing: 0.55, streamline: 0.5 })
        return <path key={stroke.id} d={getSvgPath(outline)} fill="currentColor" />
      })}
    </svg>
  )
}
