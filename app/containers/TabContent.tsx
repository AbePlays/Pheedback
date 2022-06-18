import type { Comment, Post, Upvote } from '@prisma/client'
import type { FunctionComponent } from 'react'

import { StatusCard } from '~/components'

interface Props {
  content: (Post & { comments: Comment[]; upvotes: Upvote[] })[]
  desc: string
  title?: string
}

const TabContent: FunctionComponent<Props> = ({ content, desc, title }) => {
  return (
    <>
      <div className="my-6">
        {title ? <h2 className="font-bold">{title}</h2> : null}
        <span className="text-gray-600">{desc}</span>
      </div>
      {content.length ? (
        <ul className="space-y-4">
          {content.map((item) => (
            <li className="relative list-none" key={item?.id}>
              <StatusCard color="blue-500" post={item} />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  )
}

export default TabContent
