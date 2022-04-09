import type { Comment, Post } from '@prisma/client'
import type { FunctionComponent } from 'react'
import { Link } from 'remix'

interface Props {
  content: (Post & { comment: Comment[] })[]
}

const Roadmap: FunctionComponent<Props> = ({ content }) => {
  const count = { planned: 0, inProgress: 0, live: 0 }
  content.forEach((item) => {
    if (item.status === 'Planned') {
      count.planned += 1
    } else if (item.status === 'In Progress') {
      count.inProgress += 1
    } else if (item.status === 'Live') {
      count.live += 1
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Roadmap</h2>
        <Link className="font-light text-blue-500 underline" prefetch="intent" to="/roadmap">
          View
        </Link>
      </div>
      <ul className="space-y-3 font-medium text-gray-500">
        <TaskStatus color="bg-red-500" title="Planned" quantity={count.planned} />
        <TaskStatus color="bg-yellow-500" title="In-Progress" quantity={count.inProgress} />
        <TaskStatus color="bg-blue-500" title="Live" quantity={count.live} />
      </ul>
    </div>
  )
}

const TaskStatus = ({ color, title, quantity }: { color: string; title: string; quantity: number }) => {
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
