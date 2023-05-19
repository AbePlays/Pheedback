import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Comment, User } from '@prisma/client'
import { type SerializeFrom } from '@remix-run/node'
import { Form } from '@remix-run/react'
import Avatar from 'boring-avatars'

import { Button } from '~/components'
import { IconCross } from '~/icons'
import { timeDifference } from '~/utils'

interface Props {
  comments: SerializeFrom<(Comment & { user: User })[]>
  user: User
}

export default function Comments({ comments, user }: Props) {
  const [parent] = useAutoAnimate<HTMLUListElement>()

  return (
    <>
      <h2 className="font-bold">
        {comments.length} Comment{comments.length > 1 && 's'}
      </h2>
      <ul className="mb-4 mt-8 space-y-8 px-2 md:px-4" ref={parent}>
        {comments.map((comment) => (
          <li className="flex justify-between gap-4" key={comment.id}>
            <div className="flex gap-4">
              <div aria-hidden>
                <Avatar name={comment.user.username} size="30" variant="beam" />
              </div>
              <div>
                <h2 className="font-bold">
                  {comment.user.username.trim()}
                  <span className="font-normal text-gray-500 dark:text-gray-500" title={comment.createdAt.toString()}>
                    {` ·`} {timeDifference(new Date(comment.createdAt))}
                  </span>
                </h2>
                {/* <span className="text-gray-500 dark:text-gray-500">@{comment.user.username}</span> */}
                <p className="mt-2 text-gray-600 dark:text-gray-400">{comment.content}</p>
              </div>
            </div>
            {user?.id === comment.userId ? (
              <Form method="post" replace>
                <input type="hidden" name="commentId" value={comment.id} />
                <input type="hidden" name="userId" value={user?.id} />
                <Button
                  aria-label="Delete Comment"
                  className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 hover:dark:text-gray-400"
                  name="_action"
                  title="Delete Comment"
                  value="delete"
                  variant="unstyled"
                >
                  <IconCross />
                </Button>
              </Form>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  )
}
