import type { FunctionComponent } from 'react'

// dark:border-gray-700 dark:bg-gray-800

const Card: FunctionComponent<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '' }) => {
  return (
    <div className={`w-full rounded-lg border border-gray-100 bg-white p-6 shadow-sm ${className}`.trim()}>
      {children}
    </div>
  )
}

export default Card
