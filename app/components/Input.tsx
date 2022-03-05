import type { FunctionComponent } from 'react'

// dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500

const Input: FunctionComponent<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', id, name, type }) => {
  const classes =
    'w-full rounded-lg border border-gray-300 bg-gray-100 p-4 text-gray-500 focus:border-fuchsia-700 focus:ring-fuchsia-700'

  return <input className={`${classes} ${className}`.trim()} id={id} name={name} type={type} />
}

export default Input
