import type { Comment, Post, User } from '@prisma/client'
import type { FunctionComponent } from 'react'
import { Form, Link } from 'remix'
import { useEffect, useRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'

import { Button, Card, CategoryFilter, RoadMap } from '~/components'
import { IconCross } from '~/icons'

type TLoaderData = {
  category: string
  posts: (Post & { user: User; comment: (Comment & { user: User })[] })[]
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
                {/* TODO: implement logic to generate user avatar */}
                <img
                  alt="user avatar"
                  className="mx-auto h-10 w-10"
                  src="https://avatars.dicebear.com/api/human/339.svg"
                />
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
        <RoadMap />
      </Card>
    </div>
  )
}

export default MenuDialogContent
