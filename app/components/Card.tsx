import type { FunctionComponent } from 'react'

interface Props {
  //TODO: Add proper prop types
  foo?: unknown
}

const Card: FunctionComponent<Props> = ({ children }) => {
  //TODO: Implement Card component styling
  return <div>{children}</div>
}

export default Card
