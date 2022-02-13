import type { FunctionComponent } from 'react'

interface Props {
  classes?: React.InputHTMLAttributes<HTMLInputElement>['className']
}

const IconArrowBack: FunctionComponent<Props> = ({ classes = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-5 w-5 ${classes}`.trim()}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  )
}

export default IconArrowBack
