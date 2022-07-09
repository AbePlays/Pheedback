import type { Comment, Post, Upvote, User } from '@prisma/client'
import type { ComponentProps, FunctionComponent } from 'react'
import { Link, useFetcher } from 'remix'

import { IconChevron, IconComment } from '~/icons'
import Button from './Button'
import Card from './Card'

interface Props {
  color: string
  post: Post & { comments: Comment[]; upvotes: Upvote[] }
  user: User
}

const btnClasses =
  'absolute bottom-4 left-6 z-10 flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-1 font-semibold text-blue-50 transition-all duration-300 disabled:opacity-50 enabled:hover:-translate-y-1 enabled:hover:opacity-70'

const StatusCard: FunctionComponent<ComponentProps<'div'> & Props> = ({ color, post, user }) => {
  const fetcher = useFetcher()
  const isUpvotesToggled = user && fetcher.submission?.formData.get('userId') === user.id

  const currCount = post.upvotes.length
  const hasUserLikedPost = user && post.upvotes.some((upvote) => upvote.userId === user.id)
  const optimisticCount = hasUserLikedPost ? currCount - 1 : currCount + 1

  // GOTTA LOVE REMIX.RUN FOR PROVIDING THESE APIS TO BUILD OPTIMISTIC UI

  const isLive = post.status === 'Live'
  const isInProgress = post.status === 'In Progress'
  const bgColor = `bg-${color}`

  return (
    <>
      <Link className="group focus:outline-none" prefetch="intent" to={`/post/${post.id}`}>
        <Card
          className={`space-y-4 border-t-[6px] ring-offset-2 transition-all group-hover:ring group-hover:ring-blue-500 group-focus:ring group-focus:ring-blue-500 ${
            isLive ? 'border-t-red-500' : isInProgress ? 'border-t-yellow-500' : 'border-t-blue-500'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`h-2 w-2 rounded-full ${bgColor}`} />
            <span className="text-gray-500 dark:text-gray-300">{post.status}</span>
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="font-bold">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-400">{post.detail}</p>
            </div>
            <span className="block w-max rounded-lg bg-blue-50 py-2 px-3 text-sm font-semibold text-blue-500">
              {post.category}
            </span>
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-2">
                <IconComment />
                <span>{post.comments.length}</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
      <fetcher.Form action="/upvote" method="post">
        <input type="hidden" name="postId" value={post.id} />
        <input type="hidden" name="userId" value={user?.id} />
        <Button className={btnClasses} disabled={!user?.id || isUpvotesToggled} variant="unstyled">
          <IconChevron className="h-3 w-4" />
          {isUpvotesToggled ? optimisticCount : currCount}
        </Button>
      </fetcher.Form>
    </>
  )
}

export default StatusCard
