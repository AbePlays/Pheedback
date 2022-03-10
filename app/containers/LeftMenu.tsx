import type { Post, User } from '@prisma/client'
import type { FunctionComponent, RefObject } from 'react'
import { Form, Link } from 'remix'
import * as Popover from '@radix-ui/react-popover'

import { Button, Card } from '~/components'
import { categoryOptions } from '~/data'
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
    <div className="hidden md:flex md:gap-4 lg:block lg:space-y-4">
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
                <Popover.Content className="dropdown">
                  <Popover.Close className="hidden" ref={closeRef} />
                  <Form action="/logout" method="post">
                    <Button className="dropdown-item" variant="unstyled">
                      Logout
                    </Button>
                  </Form>
                  {/* TODO: Implement this logic */}
                  <Button className="dropdown-item" type="button" variant="unstyled">
                    Your Upvotes
                  </Button>
                </Popover.Content>
              </Popover.Root>
            </>
          </>
        ) : (
          <Link className="link-btn w-full px-10 py-3 text-center font-medium text-white" to="/auth">
            Log In
          </Link>
        )}
      </Card>

      {/* Pheedback Card */}
      <Card className="flex max-w-xs items-center justify-center overflow-hidden rounded-xl bg-[url('/background-header.png')] bg-cover bg-no-repeat p-0 text-left lg:h-40">
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
            disabled={isFormSubmitting}
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
              disabled={isFormSubmitting}
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
  )
}

export default LeftMenu
