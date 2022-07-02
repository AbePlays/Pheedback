import type { Comment, Post, Upvote, User } from '@prisma/client'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useEffect, useRef } from 'react'
import type { HeadersFunction, LoaderFunction, MetaFunction } from 'remix'
import { useLoaderData, useTransition } from 'remix'

import { Card } from '~/components'
import { LeftMenu, MainContent, MenuDialogContent } from '~/containers'
import { sortByEnum } from '~/data'
import { IconMenu } from '~/icons'
import { getUser } from '~/lib/db.server'
import { db } from '~/utils'

type TLoaderData = {
  category: string
  sortBy: string
  posts: (Post & { user: User; comments: (Comment & { user: User })[]; upvotes: Upvote[] })[]
  user: User
  userUpvotes: string
}

export const headers: HeadersFunction = () => {
  return { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59' }
}

export const meta: MetaFunction = () => {
  return { title: 'Home | Pheedback', description: 'Welcome to Pheedback!' }
}

export const loader: LoaderFunction = async ({ request }) => {
  //TODO: Fetch user data and posts in parallel, export logic to a function
  const user = await getUser(request)

  const url = new URL(request.url)
  const category = url.searchParams.get('category')
  const sortBy = url.searchParams.get('sortBy')
  const userUpvotes = url.searchParams.get('userUpvotes')

  if (userUpvotes === 'true' && !user) {
    throw new Response('User not authenticated', { status: 401 })
  }

  let posts = []
  let order: 'asc' | 'desc' = 'desc'

  if (sortBy && sortBy === sortByEnum.LEAST_UPVOTES) {
    order = 'asc'
  }

  let where
  let orderBy

  if (category && sortBy) {
    where = { category }
    orderBy = { upvotes: { _count: order } }
  } else if (sortBy) {
    orderBy = { upvotes: { _count: order } }
  } else if (category) {
    where = { category }
    orderBy = { createdAt: order }
  } else {
    orderBy = { upvotes: { _count: order } }
  }

  posts = await db.post.findMany({
    where,
    orderBy,
    include: { user: { select: { username: true } }, comments: true, upvotes: true },
  })

  if (userUpvotes === 'true' && user) {
    posts = posts.filter((post) => {
      return post.upvotes.some((upvote) => upvote.userId === user.id)
    })
  }

  return { category, sortBy, posts, user, userUpvotes }

  // return { category: '', sortBy: '', posts: [], user }
}

const IndexRoute = () => {
  const loaderData = useLoaderData<TLoaderData>()
  const transition = useTransition()

  const closeRef = useRef<HTMLButtonElement>(null)

  const isFormSubmitting = Boolean(transition.submission)
  const isUserPresent = loaderData.user !== null
  const showPosts = loaderData?.posts?.length > 0

  useEffect(() => {
    if (isFormSubmitting) {
      closeRef.current?.click()
    }
  }, [isFormSubmitting])

  return (
    <main className="mx-auto max-w-screen-xl md:flex md:flex-col md:gap-4 md:px-4 md:pt-8 lg:flex-row">
      <LeftMenu
        closeRef={closeRef}
        isFormSubmitting={isFormSubmitting}
        isUserPresent={isUserPresent}
        loaderData={loaderData}
      />
      <div className="flex-1">
        <Card className="flex h-20 items-center justify-between rounded-none border-0 bg-[url('/background-header.png')] bg-cover bg-no-repeat p-4 text-white md:hidden">
          <h2 className="text-lg font-bold">Pheedback Board</h2>
          <DialogPrimitive.Root>
            <DialogPrimitive.Trigger aria-label="Menu">
              <IconMenu />
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Content className="fixed top-0 right-0 bottom-0 z-20 w-full bg-gray-50 py-6 px-4 animate-in fade-in slide-in-from-top-[60%] md:hidden">
                <DialogPrimitive.Title className="sr-only">Navigation Menu</DialogPrimitive.Title>
                <MenuDialogContent
                  loaderData={loaderData}
                  isFormSubmitting={isFormSubmitting}
                  isUserPresent={isUserPresent}
                />
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
        </Card>
        <MainContent
          closeRef={closeRef}
          isFormSubmitting={isFormSubmitting}
          loaderData={loaderData}
          showPosts={showPosts}
        />
      </div>
    </main>
  )
}

export default IndexRoute
