import type { Post, User } from '@prisma/client'
import type { LoaderFunction, MetaFunction } from 'remix'
import { Form, Link, useLoaderData, useTransition } from 'remix'
import { useEffect, useRef } from 'react'
import * as Popover from '@radix-ui/react-popover'

import { Button, Card, Feedback } from '~/components'
import { LeftMenu } from '~/containers'
import { sortByEnum } from '~/data'
import { IconBulb, IconDown } from '~/icons'
import { getUser } from '~/lib/db.server'
import { db } from '~/utils'

type TLoaderData = {
  category: string
  sortBy: string
  posts: (Post & { user: User; comment: (Comment & { user: User })[] })[]
  user: User
}

export const meta: MetaFunction = () => {
  return {
    title: 'Home | Pheedback',
    description: 'Welcome to Pheedback!',
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  //TODO: Fetch user data and posts in parallel, export logic to a function
  const user = await getUser(request)

  const url = new URL(request.url)
  const category = url.searchParams.get('category')
  const sortBy = url.searchParams.get('sortBy')

  let posts = []
  let order: 'asc' | 'desc' = 'desc'

  if (sortBy && sortBy === sortByEnum.LEAST_UPVOTES) {
    order = 'asc'
  }

  if (category && sortBy) {
    posts = await db.post.findMany({
      where: { category },
      orderBy: { upvotes: order },
      include: { user: true, comment: true },
    })
  } else if (category) {
    posts = await db.post.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' },
      include: { user: true, comment: true },
    })
  } else if (sortBy) {
    posts = await db.post.findMany({ orderBy: { upvotes: order }, include: { user: true, comment: true } })
  } else {
    posts = await db.post.findMany({ orderBy: { createdAt: 'desc' }, include: { user: true, comment: true } })
  }

  return { category, sortBy, posts, user }

  // return { category: '', sortBy: '', posts: [], user }
}

const IndexRoute = () => {
  const loaderData = useLoaderData<TLoaderData>()
  const closeRef = useRef<HTMLButtonElement>(null)
  const transition = useTransition()

  const isFormSubmitting = transition.submission
  const showPosts = loaderData?.posts?.length > 0

  const isUserPresent = loaderData.user !== null

  useEffect(() => {
    closeRef.current?.click()
  }, [isFormSubmitting])

  return (
    <div>
      <main className="mx-auto flex max-w-screen-xl gap-4 text-center md:flex-col md:px-4 md:py-8 lg:flex-row">
        <LeftMenu
          closeRef={closeRef}
          isFormSubmitting={Boolean(isFormSubmitting)}
          isUserPresent={isUserPresent}
          loaderData={loaderData}
        />
        <div className="flex-1 space-y-4">
          {/* Sort By Form */}
          <Card className="flex flex-wrap items-center gap-2 rounded-none bg-gray-700 p-3 text-sm text-white sm:p-6 sm:text-base md:rounded-lg">
            <div className="hidden sm:flex sm:items-center sm:gap-2">
              <IconBulb aria-label="" />
              <span className="font-bold">{loaderData?.posts?.length || 0} Suggestions</span>
            </div>
            <div className="flex flex-1 items-center sm:justify-center">
              <Popover.Root>
                <Popover.Trigger aria-label="Sort by" className="flex gap-2" disabled={Boolean(isFormSubmitting)}>
                  <span>Sort by: {loaderData.sortBy || 'Most Upvotes'}</span>
                  <IconDown />
                </Popover.Trigger>
                <Popover.Content className="dropdown">
                  <Popover.Close className="hidden" ref={closeRef} />
                  <Form>
                    <input type="hidden" name="category" value={loaderData?.category || ''} />
                    {Object.values(sortByEnum).map((sortBy) => (
                      <Button
                        className="dropdown-item"
                        disabled={Boolean(isFormSubmitting)}
                        key={sortBy}
                        name="sortBy"
                        value={sortBy}
                        variant="unstyled"
                      >
                        {sortBy}
                      </Button>
                    ))}
                  </Form>
                </Popover.Content>
              </Popover.Root>
            </div>
            <Link className="link-btn py-3 px-4" to="/post/new">
              + Add Feedback
            </Link>
          </Card>

          {/* Posts */}
          {showPosts ? (
            <ul className="space-y-4 px-4 pb-4 md:px-0 md:pb-0">
              {loaderData.posts.map((post) => {
                return (
                  <li className="relative" key={post.id}>
                    <Feedback post={post} />
                  </li>
                )
              })}
            </ul>
          ) : (
            <p>No feedbacks available</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default IndexRoute
