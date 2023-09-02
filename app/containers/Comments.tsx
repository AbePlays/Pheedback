import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Comment, User } from '@prisma/client'
import { type SerializeFrom } from '@remix-run/node'

import CommentComp from './Comment'

interface Props {
  comments: SerializeFrom<(Comment & { user: User })[]>
  user: Partial<User> | null
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
            <CommentComp comment={comment} user={user} />
          </li>
        ))}
      </ul>
    </>
  )
}
