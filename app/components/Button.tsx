import type { FunctionComponent } from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'link' | 'solid' | 'unstyled'
}

// dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800

const Button: FunctionComponent<Props> = ({ children, className = '', variant = 'solid', ...props }) => {
  let classes = 'transition-all duration-300 hover:opacity-70'
  if (variant === 'solid') {
    classes = `${classes} w-full rounded-lg bg-fuchsia-600 px-10 py-4 font-medium text-white hover:-translate-y-1 focus:ring-2 focus:ring-fuchsia-700`
  } else if (variant === 'link') {
    classes = `${classes} text-fuchsia-600 hover:text-fuchsia-700 hover:underline`
  } else if (variant === 'unstyled') {
    classes = ''
  }

  classes = `${classes} ${className}`.trim()

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
