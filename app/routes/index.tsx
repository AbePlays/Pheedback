import type { Post, User } from '@prisma/client'
import type { LoaderFunction, MetaFunction } from 'remix'
import { Form, Link, useLoaderData, useTransition } from 'remix'
import { useEffect, useRef } from 'react'
import * as Popover from '@radix-ui/react-popover'

import { Button, Card, Feedback } from '~/components'
import { categoryOptions, sortByEnum } from '~/data'
import { IconBulb, IconDots, IconDown } from '~/icons'
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
      <main className="mx-auto flex max-w-screen-xl gap-4 px-4 py-8 text-center">
        <div className="space-y-4">
          {/* User Info */}
          <Card className="flex max-w-xs items-start justify-between rounded-xl text-left">
            {isUserPresent ? (
              <>
                <div className="flex gap-4">
                  {/* TODO: implement logic to generate user avatar */}
                  <img alt="user avatar" className="h-10 w-10" src="https://avatars.dicebear.com/api/human/339.svg" />
                  <div>
                    <h2 className="font-bold">{loaderData.user?.fullname}</h2>
                    <span className="text-sm">@{loaderData.user?.username}</span>
                  </div>
                </div>
                <>
                  <Popover.Root>
                    <Popover.Trigger aria-label="Select Option">
                      <IconDots />
                    </Popover.Trigger>
                    <Popover.Content className="w-[15rem] rounded bg-white py-2 shadow animate-in fade-in slide-in-from-top-4">
                      <Popover.Close className="hidden" ref={closeRef} />
                      <Form action="/logout" method="post">
                        <Button
                          className="h-12 w-full border-l-4 border-white outline-none hover:border-fuchsia-500 hover:bg-gray-200 focus-visible:border-fuchsia-500 focus-visible:bg-gray-200"
                          variant="unstyled"
                        >
                          Logout
                        </Button>
                      </Form>
                      {/* TODO: Implement this logic */}
                      <Button
                        className="h-12 w-full border-l-4 border-white outline-none hover:border-fuchsia-500 hover:bg-gray-200 focus-visible:border-fuchsia-500 focus-visible:bg-gray-200"
                        type="button"
                        variant="unstyled"
                      >
                        Your Upvotes
                      </Button>
                    </Popover.Content>
                  </Popover.Root>
                </>
              </>
            ) : (
              <Link
                className="block w-full rounded-lg bg-fuchsia-600 px-10 py-3 text-center font-medium text-white transition-all duration-200 hover:-translate-y-1 hover:opacity-70"
                to="/auth"
              >
                Log In
              </Link>
            )}
          </Card>

          {/* Pheedback Card */}
          <Card className="flex h-40 max-w-xs items-center justify-center overflow-hidden rounded-xl bg-[url('/background-header.png')] bg-cover bg-no-repeat p-0 text-left">
            <h2 className="text-lg font-bold text-white">Pheedback Board</h2>
          </Card>

          {/* Category Form */}
          <Card className="flex max-w-xs items-start justify-between rounded-xl text-left">
            <Form className="flex flex-wrap gap-4">
              <input type="hidden" name="sortBy" value={loaderData?.sortBy || ''} />
              <Button
                className={`w-max rounded-lg py-2 px-3 text-sm font-semibold hover:bg-blue-100 focus:ring-blue-500 ${
                  !loaderData.category ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-500'
                }`}
                disabled={Boolean(isFormSubmitting)}
                name="category"
                value=""
              >
                All
              </Button>
              {categoryOptions.map((category) => (
                <Button
                  className={`w-max rounded-lg py-2 px-3 text-sm font-semibold hover:bg-blue-100 focus:ring-blue-500 ${
                    loaderData?.category === category ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-500'
                  }`}
                  disabled={Boolean(isFormSubmitting)}
                  key={category}
                  name="category"
                  value={category}
                >
                  {category}
                </Button>
              ))}
            </Form>
          </Card>
        </div>

        <div className="flex-1 space-y-4">
          {/* Sort By Form */}
          <Card className="flex items-center gap-2 bg-gray-700 text-white">
            <IconBulb aria-label="" />
            <span className="font-bold">{loaderData?.posts?.length || 0} Suggestions</span>
            <div className="flex flex-1 items-center justify-center">
              <Popover.Root>
                <Popover.Trigger aria-label="Sort by" className="flex gap-2" disabled={Boolean(isFormSubmitting)}>
                  <span>Sort by: {loaderData.sortBy || 'Most Upvotes'}</span>
                  <IconDown />
                </Popover.Trigger>
                <Popover.Content className="w-[15rem] rounded bg-white py-2 shadow animate-in fade-in slide-in-from-top-4">
                  <Popover.Close className="hidden" ref={closeRef} />
                  <Form>
                    <input type="hidden" name="category" value={loaderData?.category || ''} />
                    {Object.values(sortByEnum).map((sortBy) => (
                      <Button
                        className="h-12 w-full border-l-4 border-white outline-none hover:border-fuchsia-500 hover:bg-gray-200 focus-visible:border-fuchsia-500 focus-visible:bg-gray-200"
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
            <Link
              className="rounded-lg bg-fuchsia-600 py-2.5 px-4 transition-all duration-300 hover:-translate-y-1 hover:opacity-70 focus:opacity-70 focus:ring"
              to="/post/new"
            >
              + Add Feedback
            </Link>
          </Card>

          {/* Posts */}
          {showPosts ? (
            <ul className="space-y-4">
              {loaderData.posts.map((post) => {
                return (
                  <li className="relative" key={post.id}>
                    <Feedback post={post} />
                  </li>
                )
              })}
            </ul>
          ) : (
            <p>No posts available</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default IndexRoute
