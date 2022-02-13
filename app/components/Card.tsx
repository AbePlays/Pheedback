import type { FunctionComponent } from 'react'

interface Props {
  classes?: string
}

// dark:border-gray-700 dark:bg-gray-800

const Card: FunctionComponent<Props> = ({ children, classes = '' }) => {
  return (
    <div
      className={`w-full rounded-lg border border-gray-100 bg-white p-6 shadow-sm ${classes}`.trim()}
    >
      {children}
    </div>
  )
}

export default Card
