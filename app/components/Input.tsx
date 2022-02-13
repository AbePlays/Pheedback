import type { FunctionComponent } from 'react'

interface Props {
  classes?: React.InputHTMLAttributes<HTMLInputElement>['className']
  id: React.InputHTMLAttributes<HTMLInputElement>['id']
  name: React.InputHTMLAttributes<HTMLInputElement>['name']
  type: React.InputHTMLAttributes<HTMLInputElement>['type']
  [key: string]: unknown
}

// dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500

const Input: FunctionComponent<Props> = ({
  classes = '',
  id,
  name,
  type,
  ...props
}) => {
  return (
    <input
      className={`w-full rounded-lg border border-gray-300 bg-gray-100 p-4 text-gray-500 focus:border-fuchsia-700 focus:ring-fuchsia-700 ${classes}`.trim()}
      id={id}
      name={name}
      type={type}
      {...props}
    />
  )
}

export default Input
