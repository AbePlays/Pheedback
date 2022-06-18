import type { FunctionComponent } from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'link' | 'solid' | 'unstyled'
}

// dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800

const Button: FunctionComponent<Props> = ({ className = '', disabled = false, variant = 'solid', ...props }) => {
  let classes = `transition-all duration-300 outline-none ${disabled ? 'bg-opacity-70' : 'hover:opacity-70'}`
  if (variant === 'solid') {
    classes = `${classes} w-full rounded-lg bg-fuchsia-600 px-10 h-12 font-medium text-white ${
      disabled ? '' : 'hover:-translate-y-1'
    } focus:ring-2 focus:ring-offset-1 focus:ring-fuchsia-700`
  } else if (variant === 'link') {
    classes = `${classes} text-fuchsia-600 hover:text-fuchsia-700 hover:underline`
  } else if (variant === 'unstyled') {
    classes = ''
  }

  classes = `${classes} ${className}`.trim()

  return <button className={classes} disabled={disabled} {...props} />
}

export default Button
