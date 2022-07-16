import { useAutoAnimate } from '@formkit/auto-animate/react'
import type { Comment, Post, Upvote, User } from '@prisma/client'
import * as Popover from '@radix-ui/react-popover'
import type { FunctionComponent, RefObject } from 'react'
import { Form, Link } from 'remix'

import { Button, Card, Feedback } from '~/components'
import { sortByEnum } from '~/data'
import { useRouteData } from '~/hooks'
import { IconBulb, IconDown } from '~/icons'

type TLoaderData = {
  category: string
  sortBy: string
  posts: (Post & { user: User; comments: (Comment & { user: User })[]; upvotes: Upvote[] })[]
  user: User
}

interface Props {
  closeRef: RefObject<HTMLButtonElement>
  isFormSubmitting: boolean
}

const MainContent: FunctionComponent<Props> = ({ closeRef, isFormSubmitting }) => {
  const data = useRouteData<TLoaderData>('routes/index')

  if (!data) {
    throw new Error('No data found')
  }

  const showPosts = data.posts?.length > 0

  const [parent] = useAutoAnimate<HTMLUListElement>()

  return (
    <>
      <Card className="flex flex-wrap items-center gap-2 rounded-none border-0 bg-gray-700 p-3 text-sm text-white dark:border dark:border-gray-600 sm:p-6 sm:text-base md:rounded-lg">
        <div className="hidden sm:flex sm:items-center sm:gap-2">
          <IconBulb aria-label="" />
          <span className="font-bold">{data?.posts?.length || 0} Suggestions</span>
        </div>
        <Form action="/" hidden id="sortby-form">
          <input type="hidden" name="category" value={data?.category || ''} />
        </Form>
        <div className="flex flex-1 items-center sm:justify-center">
          <Popover.Root>
            <Popover.Trigger aria-label="Sort by" className="flex gap-2" disabled={Boolean(isFormSubmitting)}>
              <span>Sort by: {data.sortBy || 'Most Upvotes'}</span>
              <IconDown />
            </Popover.Trigger>
            <Popover.Content className="dropdown" sideOffset={10}>
              <Popover.Close className="hidden" ref={closeRef} />
              {Object.values(sortByEnum).map((sortBy) => (
                <Button
                  className="dropdown-item"
                  disabled={isFormSubmitting}
                  form="sortby-form"
                  key={sortBy}
                  name="sortBy"
                  value={sortBy}
                  variant="unstyled"
                >
                  {sortBy}
                </Button>
              ))}
            </Popover.Content>
          </Popover.Root>
        </div>
        <Link
          className="link-btn py-3 px-4 focus:ring-white focus:ring-offset-gray-700 dark:focus:ring-fuchsia-600"
          prefetch="intent"
          to="/post/new"
        >
          + Add Feedback
        </Link>
      </Card>
      {showPosts ? (
        <ul className="space-y-4 px-4 py-4 md:px-0" ref={parent}>
          {data.posts.map((post) => (
            <li className="relative" key={post.id}>
              <Feedback asLink post={post} user={data.user} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="pt-4 text-center dark:text-gray-200">No feedbacks available</p>
      )}
    </>
  )
}

export default MainContent
