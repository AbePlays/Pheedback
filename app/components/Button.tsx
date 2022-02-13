import type { FunctionComponent } from 'react'

interface Props {
  classes?: React.ButtonHTMLAttributes<HTMLButtonElement>['className']
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>['onClick']
  type: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
  variant?: 'link' | 'solid'
}

// dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800

const Button: FunctionComponent<Props> = ({
  children,
  classes = '',
  onClick = undefined,
  type = 'button',
  variant = 'solid',
}) => {
  let className = 'transition-all duration-300 hover:opacity-70'
  if (variant === 'solid') {
    className = `${className} w-full rounded-lg bg-fuchsia-600 px-10 py-4 font-medium text-white hover:-translate-y-1 focus:ring-4 focus:ring-fuchsia-700`
  } else if (variant === 'link') {
    className = `${className} text-fuchsia-600 hover:text-fuchsia-700 hover:underline`
  }

  className = `${className} ${classes}`.trim()

  return (
    <button className={className} type={type} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
