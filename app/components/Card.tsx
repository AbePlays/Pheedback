import type { FunctionComponent } from 'react'

// dark:border-gray-700 dark:bg-gray-800

const Card: FunctionComponent<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => {
  return (
    <div className={`w-full rounded-xl border border-gray-100 bg-white p-6 shadow-sm ${className}`.trim()} {...props} />
  )
}

export default Card
