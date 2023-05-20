import type { Comment, Post, Upvote, User } from '@prisma/client'
import * as Popover from '@radix-ui/react-popover'
import { Form, Link } from '@remix-run/react'
import Avatar from 'boring-avatars'
import type { RefObject } from 'react'

import { Button, Card, CategoryFilter, RoadMap } from '~/components'
import { useRouteData } from '~/hooks'
import { IconCheck, IconDots } from '~/icons'

type TLoaderData = {
  category: string
  posts: (Post & { user: User; comments: (Comment & { user: User })[]; upvotes: Upvote[] })[]
  sortBy: string
  user: User
  userUpvotes: string
}

interface Props {
  closeRef: RefObject<HTMLButtonElement>
  isFormSubmitting: boolean
}

function LeftMenu({ closeRef, isFormSubmitting }: Props) {
  const data = useRouteData<TLoaderData>('routes/index')

  if (!data) {
    throw new Error('No data found')
  }

  const isUserPresent = data.user

  return (
    <div className="hidden md:flex md:w-full md:gap-4 lg:max-w-xs lg:flex-col">
      <div className="flex-1 space-y-4 lg:flex-none">
        {/* User Info */}
        <Card className="flex items-start justify-between gap-4 text-left">
          {isUserPresent ? (
            <>
              <div className="flex gap-4">
                <Avatar name={data?.user?.username} variant="beam" />
                <div>
                  <h2 className="font-bold">{data.user?.fullname?.split(' ')?.[0]}</h2>
                  <span className="text-sm text-gray-800 dark:text-gray-300">@{data.user?.username}</span>
                </div>
              </div>
              <Form action="/logout" hidden id="logout-form" method="post" />
              <Form action="/" hidden id="userUpvotes" />
              <Popover.Root>
                <Popover.Trigger aria-label="Select Option">
                  <IconDots />
                </Popover.Trigger>
                <Popover.Content align="end" className="dropdown" sideOffset={10}>
                  <Popover.Close hidden ref={closeRef} />
                  <Button className="dropdown-item" form="logout-form" variant="unstyled">
                    Logout
                  </Button>
                  <Button
                    className="dropdown-item flex items-center justify-center gap-4"
                    form="userUpvotes"
                    name="userUpvotes"
                    value={data.userUpvotes === 'true' ? 'false' : 'true'}
                    variant="unstyled"
                  >
                    {data.userUpvotes === 'true' ? <IconCheck /> : null}
                    Your Upvotes
                  </Button>
                </Popover.Content>
              </Popover.Root>
            </>
          ) : (
            <Link className="link-btn w-full py-3 text-center font-medium text-white" prefetch="intent" to="/auth">
              Log In
            </Link>
          )}
        </Card>

        {/* Pheedback Card */}
        <Card className="flex h-24 items-center justify-center bg-[url('/background-header.png')] bg-cover bg-no-repeat p-0 lg:h-40">
          <h2 className="text-base font-bold text-white lg:text-lg">Pheedback Board</h2>
        </Card>
      </div>

      {/* Category Form */}
      <Card className="flex flex-1 items-start justify-between text-left lg:flex-none">
        <CategoryFilter
          category={data?.category || ''}
          isFormSubmitting={isFormSubmitting}
          sortBy={data?.sortBy || ''}
        />
      </Card>

      {/* Roadmao Card */}
      <Card className="flex-1 lg:flex-none">
        <RoadMap content={data.posts} />
      </Card>
    </div>
  )
}

export default LeftMenu
