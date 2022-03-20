import type { FunctionComponent } from 'react'

const IconDown: FunctionComponent<React.SVGAttributes<SVGElement>> = ({ className = '', ...props }) => {
  return (
    <svg
      className={`h-5 w-5 ${className}`.trim()}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4 6H11L7.5 10.5L4 6Z" fill="currentColor"></path>
    </svg>
  )
}

export default IconDown
