import type { Comment, Post, Upvote, User } from '@prisma/client'
import Avatar from 'boring-avatars'
import type { FunctionComponent } from 'react'
import { Link, useFetcher } from '@remix-run/react'

import { Button, Card } from '~/components'
import { IconChevron, IconComment } from '~/icons'
import { formatDate } from '~/utils'

interface Props {
  asLink?: boolean
  post: Post & { user: User; comments: (Comment & { user: User })[]; upvotes: Upvote[] }
  user: User
}

const btnClasses =
  'absolute bottom-6 left-6 z-10 flex h-max items-center gap-2 outline-none rounded-lg bg-blue-500 px-3 py-2 font-semibold text-blue-50 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:top-6 sm:block sm:py-3 sm:px-4 disabled:opacity-50 enabled:hover:-translate-y-1 enabled:hover:opacity-70 dark:ring-offset-gray-800'

const Content: FunctionComponent<Omit<Props, 'user'>> = ({ post }) => {
  return (
    <>
      <Card className="flex gap-4 text-left ring-offset-2 transition-all group-hover:ring group-hover:ring-blue-500 group-focus:ring group-focus:ring-blue-500 dark:ring-offset-gray-800">
        <div className="mb-14 flex-1 space-y-4 sm:mb-0 sm:ml-20">
          <div className="flex items-center gap-4">
            <div className="overflow-hidden rounded-full">
              <Avatar name={post?.user?.username} variant="beam" />
            </div>
            <div className="text-sm">
              <h2 className="font-bold">{post.user?.username}</h2>
              <span className="text-gray-500 dark:text-gray-400">{formatDate(post.createdAt)}</span>
            </div>
          </div>
          <div>
            <h2 className="font-bold">{post.title}</h2>
            <p className="text-gray-500 dark:text-gray-400">{post.detail}</p>
          </div>
          <span className="block w-max rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 dark:bg-blue-200">
            {post.category}
          </span>
        </div>
        <div className="absolute bottom-8 right-6 flex items-center gap-2 sm:static">
          <IconComment />
          <span>{post.comments?.length || 0}</span>
        </div>
      </Card>
    </>
  )
}

const Cta: FunctionComponent<{ post: Props['post']; userId: string }> = ({ post, userId }) => {
  const fetcher = useFetcher()

  const isUpvotesToggled = Boolean(userId) && fetcher.submission?.formData.get('userId') === userId

  const currCount = post.upvotes.length
  const hasUserLikedPost = post.upvotes.some((upvote) => upvote.userId === userId)
  const optimisticCount = hasUserLikedPost ? currCount - 1 : currCount + 1

  // GOTTA LOVE REMIX.RUN FOR PROVIDING THESE APIS TO BUILD OPTIMISTIC UI

  return (
    <fetcher.Form method="post" action="/upvote">
      <input type="hidden" name="postId" value={post.id} />
      <input type="hidden" name="userId" value={userId} />
      <Button className={btnClasses} disabled={!userId || isUpvotesToggled} variant="unstyled">
        <IconChevron className="h-3 w-4" />
        {isUpvotesToggled ? optimisticCount : currCount}
      </Button>
    </fetcher.Form>
  )
}

const Feedback: FunctionComponent<Props> = ({ asLink = false, post, user }) => {
  if (asLink) {
    return (
      <>
        <Link className="group focus:outline-none" prefetch="intent" to={`/post/${post.id}`}>
          <Content post={post} />
        </Link>
        <Cta post={post} userId={user?.id} />
      </>
    )
  }

  return (
    <>
      <Content post={post} />
      <Cta post={post} userId={user?.id} />
    </>
  )
}

export default Feedback
