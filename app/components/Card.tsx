import type { FunctionComponent } from 'react'

const Card: FunctionComponent<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => {
  return (
    <div
      className={`w-full rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 ${className}`.trim()}
      {...props}
    />
  )
}

export default Card
