import type { Comment, Post, User } from '@prisma/client'
import type { FunctionComponent, RefObject } from 'react'
import { Form, Link } from 'remix'
import * as Popover from '@radix-ui/react-popover'

import { Button, Card, CategoryFilter, RoadMap } from '~/components'
import { IconDots } from '~/icons'

type TLoaderData = {
  category: string
  posts: (Post & { user: User; comment: (Comment & { user: User })[] })[]
  sortBy: string
  user: User
}

interface Props {
  closeRef: RefObject<HTMLButtonElement>
  isFormSubmitting: boolean
  isUserPresent: boolean
  loaderData: TLoaderData
}

const LeftMenu: FunctionComponent<Props> = ({ closeRef, isFormSubmitting, isUserPresent, loaderData }) => {
  return (
    <div className="hidden md:flex md:w-full md:gap-4 lg:max-w-xs lg:flex-col">
      <div className="flex-1 space-y-4 lg:flex-none">
        {/* User Info */}
        <Card className="flex items-start justify-between gap-4 text-left">
          {isUserPresent ? (
            <>
              <div className="flex gap-4">
                {/* TODO: implement logic to generate user avatar */}
                <img alt="user avatar" className="h-10 w-10" src="https://avatars.dicebear.com/api/human/339.svg" />
                <div>
                  <h2 className="font-bold">{loaderData.user?.fullname?.split(' ')?.[0]}</h2>
                  <span className="text-sm">@{loaderData.user?.username}</span>
                </div>
              </div>
              <Form action="/logout" hidden id="logout-form" method="post" />
              <Popover.Root>
                <Popover.Trigger aria-label="Select Option">
                  <IconDots />
                </Popover.Trigger>
                <Popover.Content align="end" className="dropdown" sideOffset={10}>
                  <Popover.Close hidden ref={closeRef} />
                  <Button className="dropdown-item" form="logout-form" variant="unstyled">
                    Logout
                  </Button>
                  {/* TODO: Implement this logic */}
                  <Button className="dropdown-item" variant="unstyled">
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
          category={loaderData?.category || ''}
          isFormSubmitting={isFormSubmitting}
          sortBy={loaderData?.sortBy || ''}
        />
      </Card>

      {/* Roadmao Card */}
      <Card className="flex-1 lg:flex-none">
        <RoadMap />
      </Card>
    </div>
  )
}

export default LeftMenu
