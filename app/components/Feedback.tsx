import type { Post, User } from '@prisma/client'
import type { FunctionComponent } from 'react'
import { Link } from 'remix'

import { Button, Card } from '~/components'
import { IconChevron, IconComment } from '~/icons'
import { formatDate } from '~/utils'

interface Props {
  post: Post & { user: User; comment: (Comment & { user: User })[] }
}

const Feedback: FunctionComponent<Props> = ({ post }) => {
  return (
    <>
      <Link className="group focus:outline-none" to={`/post/${post.id}`}>
        <Card className="flex gap-4 rounded-xl text-left ring-offset-2 transition-all group-hover:ring group-hover:ring-blue-500 group-focus:ring group-focus:ring-blue-500">
          <div className="ml-20 flex-1 space-y-4">
            <div className="flex items-center gap-4">
              {/* TODO: add logic to generate pseudo-random number for image seed */}
              <img alt="user avatar" className="h-10 w-10" src="https://avatars.dicebear.com/api/human/339.svg" />
              <div className="text-sm">
                <h2 className="font-bold">{post.user?.fullname}</h2>
                <span className="text-gray-500">{formatDate(post.createdAt)}</span>
              </div>
            </div>
            <div>
              <h2 className="font-bold">{post.title}</h2>
              <p className="text-gray-500">{post.detail}</p>
            </div>
            <span className="block w-max rounded-lg bg-blue-50 py-2 px-3 text-sm font-semibold text-blue-500">
              {post.category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <IconComment />
            <span>{post.comment?.length || 0}</span>
          </div>
        </Card>
      </Link>
      <Button
        className="absolute top-6 left-6 z-10 rounded-lg bg-blue-500 py-3 px-4 font-semibold text-blue-50 transition-all duration-300 hover:opacity-50"
        variant="unstyled"
      >
        <IconChevron className="h-3 w-4" />
        {post.upvotes}
      </Button>
    </>
  )
}

export default Feedback
