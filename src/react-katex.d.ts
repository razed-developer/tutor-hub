declare module 'react-katex' {
  import type { ComponentType, HTMLAttributes } from 'react'

  export type MathComponentProps = HTMLAttributes<HTMLElement> & {
    math: string
    errorColor?: string
    renderError?: (error: Error) => React.ReactNode
  }

  export const BlockMath: ComponentType<MathComponentProps>
  export const InlineMath: ComponentType<MathComponentProps>
}
