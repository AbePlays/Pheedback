import React from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'link' | 'solid' | 'unstyled'
}

const Button = React.forwardRef(
  (
    { className = '', disabled = false, variant = 'solid', ...props }: Props,
    forwardedRef: React.ForwardedRef<HTMLButtonElement>
  ) => {
    let classes = `transition-all duration-300 outline-none ${disabled ? 'bg-opacity-70' : 'light:hover:opacity-70'}`

    if (variant === 'solid') {
      classes = `${classes} w-full rounded-lg bg-fuchsia-600 px-10 h-12 font-medium text-white dark:ring-offset-gray-800 ${
        disabled ? '' : 'hover:-translate-y-1'
      } focus:ring-2 focus:ring-offset-1 focus:ring-fuchsia-700`
    } else if (variant === 'link') {
      classes = `${classes} text-fuchsia-500 hover:underline`
    } else if (variant === 'unstyled') {
      classes = ''
    }

    classes = `${classes} ${className}`.trim()

    return <button className={classes} disabled={disabled} {...props} ref={forwardedRef} />
  }
)

export default Button
