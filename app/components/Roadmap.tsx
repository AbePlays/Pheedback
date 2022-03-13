import type { FunctionComponent } from 'react'
import { Link } from 'remix'

const Roadmap: FunctionComponent = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Roadmap</h2>
        <Link className="font-light text-blue-500 underline" to="/">
          View
        </Link>
      </div>
      <ul className="space-y-3 font-medium text-gray-500">
        <TaskStatus color="bg-red-500" title="Planned" quantity="0" />
        <TaskStatus color="bg-yellow-500" title="In-Progress" quantity="0" />
        <TaskStatus color="bg-blue-500" title="Live" quantity="0" />
      </ul>
    </div>
  )
}

const TaskStatus = ({ color, title, quantity }: { color: string; title: string; quantity: string }) => {
  return (
    <li className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-8">
        <div className={`h-2 w-2 rounded-full ${color}`} />
        <h3>{title}</h3>
      </div>
      <span>{quantity}</span>
    </li>
  )
}

export default Roadmap
