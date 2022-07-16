import type { Comment, Post, Upvote, User } from '@prisma/client'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import Avatar from 'boring-avatars'
import type { FunctionComponent } from 'react'
import { useEffect, useRef } from 'react'
import { Form, Link } from 'remix'

import { Button, Card, CategoryFilter, RoadMap } from '~/components'
import { useRouteData } from '~/hooks'
import { IconCheck, IconCross } from '~/icons'

type TLoaderData = {
  category: string
  posts: (Post & { user: User; comments: (Comment & { user: User })[]; upvotes: Upvote[] })[]
  sortBy: string
  user: User
  userUpvotes: string
}

interface Props {
  isFormSubmitting: boolean
}

const MenuDialogContent: FunctionComponent<Props> = ({ isFormSubmitting }) => {
  const data = useRouteData<TLoaderData>('routes/index')

  if (!data) {
    throw new Error('No data found')
  }

  const closeRef = useRef<HTMLButtonElement>(null)
  const isUserPresent = data.user

  useEffect(() => {
    if (isFormSubmitting) {
      document.body.style.pointerEvents = ''
      closeRef.current?.click()
    }
  }, [isFormSubmitting])

  return (
    <div className="mt-2 space-y-4 text-sm">
      <DialogPrimitive.Close aria-label="Close Menu" className="ml-auto block dark:text-gray-50" ref={closeRef}>
        <IconCross />
      </DialogPrimitive.Close>
      <Card className="flex h-32 items-center justify-center bg-[url('/background-header.png')] bg-cover bg-no-repeat p-0">
        <h2 className="text-lg font-bold text-white">Pheedback Board</h2>
      </Card>
      <div className="flex flex-1 flex-col gap-4 sm:flex-row-reverse">
        <Card>
          {isUserPresent ? (
            <>
              <div className="space-y-4 text-center">
                <div className="mx-auto w-max overflow-hidden rounded-full">
                  <Avatar name={data?.user?.username} variant="beam" />
                </div>
                <h2 className="font-bold">{data.user?.fullname}</h2>
                <span>@{data.user?.username}</span>
              </div>
              <div className="mt-4 flex items-center justify-center text-center">
                <Form action="/logout" className="w-full" method="post">
                  <Button className="font-semibold" variant="unstyled">
                    Log Out
                  </Button>
                </Form>
                <Form action="/" className="w-full">
                  <Button
                    className="flex w-full items-center justify-center gap-2 font-semibold"
                    name="userUpvotes"
                    value={data.userUpvotes === 'true' ? 'false' : 'true'}
                    variant="unstyled"
                  >
                    {data.userUpvotes === 'true' ? <IconCheck className="h-4 w-4" /> : null}
                    Your Upvotes
                  </Button>
                </Form>
              </div>
            </>
          ) : (
            <Link
              className="link-btn block w-full py-3 text-center font-medium text-white"
              prefetch="intent"
              to="/auth"
            >
              Log In
            </Link>
          )}
        </Card>
        <Card>
          <CategoryFilter
            category={data?.category || ''}
            isFormSubmitting={isFormSubmitting}
            sortBy={data?.sortBy || ''}
          />
        </Card>
      </div>
      <Card className="flex-1">
        <RoadMap content={data.posts} />
      </Card>
    </div>
  )
}

export default MenuDialogContent
