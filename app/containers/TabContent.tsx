import type { Comment, Post, Upvote, User } from '@prisma/client'
import { type SerializeFrom } from '@remix-run/node'
import type { FunctionComponent } from 'react'

import { StatusCard } from '~/components'

interface Props {
  content: SerializeFrom<(Post & { comments: Comment[]; upvotes: Upvote[] })[]>
  desc: string
  title?: string
  user: User
}

const TabContent: FunctionComponent<Props> = ({ content, desc, title, user }) => {
  return (
    <>
      <div className="my-6">
        {title ? <h2 className="font-bold dark:text-gray-200">{title}</h2> : null}
        <span className="text-gray-600 dark:text-gray-400">{desc}</span>
      </div>
      {content.length ? (
        <ul className="space-y-4">
          {content.map((item) => (
            <li className="relative list-none" key={item?.id}>
              <StatusCard color="blue-500" post={item} user={user} />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  )
}

export default TabContent
