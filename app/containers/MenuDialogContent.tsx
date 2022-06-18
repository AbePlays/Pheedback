import type { Comment, Post, Upvote, User } from '@prisma/client'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import Avatar from 'boring-avatars'
import type { FunctionComponent } from 'react'
import { useEffect, useRef } from 'react'
import { Form, Link } from 'remix'

import { Button, Card, CategoryFilter, RoadMap } from '~/components'
import { IconCross } from '~/icons'

type TLoaderData = {
  category: string
  posts: (Post & { user: User; comments: (Comment & { user: User })[]; upvotes: Upvote[] })[]
  sortBy: string
  user: User
}

interface Props {
  isFormSubmitting: boolean
  isUserPresent: boolean
  loaderData: TLoaderData
}

const MenuDialogContent: FunctionComponent<Props> = ({ isUserPresent, isFormSubmitting, loaderData }) => {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isFormSubmitting) {
      document.body.style.pointerEvents = ''
      closeRef.current?.click()
    }
  }, [isFormSubmitting])

  return (
    <div className="mt-2 space-y-4 text-sm">
      <DialogPrimitive.Close aria-label="Close Menu" className="ml-auto block" ref={closeRef}>
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
                <Avatar name={loaderData?.user?.fullname} variant="beam" />
                <h2 className="font-bold">{loaderData.user?.fullname}</h2>
                <span>@{loaderData.user?.username}</span>
              </div>
              <div className="mt-4 flex items-center justify-center text-center">
                <Form action="/logout" className="w-full" method="post">
                  <Button className="font-semibold" variant="unstyled">
                    Log Out
                  </Button>
                </Form>
                {/* TODO: Implement this logic */}
                <Button className="w-full font-semibold" variant="unstyled">
                  Your Upvotes
                </Button>
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
            category={loaderData?.category || ''}
            isFormSubmitting={isFormSubmitting}
            sortBy={loaderData?.sortBy || ''}
          />
        </Card>
      </div>
      <Card className="flex-1">
        <RoadMap content={loaderData.posts} />
      </Card>
    </div>
  )
}

export default MenuDialogContent
