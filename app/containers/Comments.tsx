import { Comment, User } from '@prisma/client'
import Avatar from 'boring-avatars'
import type { FunctionComponent } from 'react'
import { Form } from 'remix'

import { Button } from '~/components'
import { IconCross } from '~/icons'

interface Props {
  comments: (Comment & { user: User })[]
  user: User
}

const Comments: FunctionComponent<Props> = ({ comments, user }) => {
  return (
    <>
      <h2 className="font-bold">
        {comments.length} Comment{comments.length > 1 && 's'}
      </h2>
      {comments.map((comment) => (
        <div className="my-8 px-4" key={comment.id}>
          <div className="flex justify-between gap-4">
            <div className="flex flex-1 gap-4">
              <Avatar name={comment.user.username} variant="beam" />
              <div>
                <h2 className="font-bold">{comment.user.fullname}</h2>
                <p className="text-gray-500 dark:text-gray-500">@{comment.user.username}</p>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{comment.content}</p>
              </div>
            </div>
            {user?.id === comment.userId ? (
              <Form method="post" replace>
                <input type="hidden" name="commentId" value={comment.id} />
                <input type="hidden" name="userId" value={user?.id} />
                <Button name="_action" value="delete" variant="unstyled" aria-label="Delete Comment">
                  <IconCross />
                </Button>
              </Form>
            ) : null}
          </div>
        </div>
      ))}
    </>
  )
}

export default Comments
