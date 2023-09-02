import { Comment as TComment, User } from '@prisma/client'
import { SerializeFrom } from '@remix-run/node'
import { Form, useNavigation, useSubmit } from '@remix-run/react'
import Avatar from 'boring-avatars'
import React from 'react'

import { timeDifference } from '~/utils'
import CommentDeletionModal from './CommentDeletionModal'

type Props = {
  comment: SerializeFrom<TComment & { user: User }>
  user: Partial<User> | null
}

export default function Comment(props: Props) {
  const { comment, user } = props

  const navigation = useNavigation()
  const formRef = React.useRef<HTMLFormElement>(null)
  const submit = useSubmit()

  return (
    <>
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
        <>
          <Form method="post" ref={formRef} replace>
            <input type="hidden" name="commentId" value={comment.id} />
            <input type="hidden" name="userId" value={user?.id} />
            <input type="hidden" name="_action" value="delete" />

            <CommentDeletionModal
              acceptHandler={() => submit(formRef.current)}
              isSubmitting={navigation.state === 'submitting'}
            />
          </Form>
        </>
      ) : null}
    </>
  )
}
