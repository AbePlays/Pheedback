import type { Comment, Post, User } from '@prisma/client'
import type { ActionFunction, LoaderFunction, MetaFunction } from 'remix'
import {
  Form,
  Link,
  useActionData,
  useCatch,
  useLoaderData,
  useParams,
} from 'remix'

import { createComment, getUser } from '~/lib/db.server'
import { db, validateCommentForm } from '~/utils'

type TLoaderData = {
  post: Post & { comment: (Comment & { User: User })[] }
  user: User
}

export const meta: MetaFunction = () => {
  return {
    title: 'Post | Pheedback',
    description: 'Checkout this post',
  }
}

export const loader: LoaderFunction = async ({ params, request }) => {
  //TODO: Parallelize fetching user and post data
  const { postId } = params
  const user = await getUser(request)

  const post = await db.post.findUnique({
    where: { id: postId },
    include: { comment: { where: { postId }, include: { User: true } } },
  })

  if (!post) {
    throw new Response('Post not found', { status: 404 })
  }

  return { post, user }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData())

  const errors = validateCommentForm(formData)
  if (errors) return errors

  const comment = await createComment(formData)
  if (!comment) {
    throw new Response('Comment could not be created. Sorry', { status: 500 })
  }

  return {}
}

const PostRoute = () => {
  const actionData = useActionData()
  const loaderData = useLoaderData<TLoaderData>()

  const { post, user } = loaderData
  const comments = post.comment

  return (
    <div>
      <Link to="/">Go Back</Link>

      {/* Post Info  */}
      <div>
        <div>
          <button>{post.upvotes}</button>
          <div>
            <h2>{user.fullname}</h2>
            <p>{post.createdAt}</p>
          </div>
        </div>
        <div>
          <div>
            <h2>{post.title}</h2>
            <p>{post.detail}</p>
            <span>{post.category}</span>
          </div>
          <div>{comments.length}</div>
        </div>
      </div>

      {/* Comments */}
      <div>
        <h2>{comments.length} Comments</h2>
        {comments.map((comment, index) => (
          <div key={comment.id}>
            <h2>{`${index + 1}. ${comment.User.fullname}`}</h2>
            <p>@{comment.User.username}</p>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>

      {/* Comment Form */}
      <div>
        <Form method="post">
          <input type="hidden" name="postId" value={post.id} />
          <input type="hidden" name="userId" value={user.id} />
          <label htmlFor="comment-input">Add Comment</label>
          <input
            className="block border"
            id="comment-input"
            name="comment"
            placeholder="Type your comment here"
            type="text"
            defaultValue={actionData?.fields?.comment}
            aria-invalid={Boolean(actionData?.fieldErrors?.comment)}
            aria-describedby={
              actionData?.fieldErrors?.comment ? 'comment-error' : undefined
            }
          />
          {actionData?.fieldErrors?.comment ? (
            <p id="comment-error" role="alert">
              {actionData.fieldErrors.comment}
            </p>
          ) : null}

          {actionData?.formError ? (
            <p id="comment-error" role="alert">
              {actionData.formError}
            </p>
          ) : null}
          <button type="submit">Post Comment</button>
        </Form>
      </div>
    </div>
  )
}

export const CatchBoundary = () => {
  const caught = useCatch()
  const { postId } = useParams()

  switch (caught.status) {
    case 404:
      return <div>Could not find post by the id {postId}</div>
    default: {
      throw new Error(`Unhandled error: ${caught.status}`)
    }
  }
}

export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.error(error)
  const { postId } = useParams()

  return (
    <div>{`There was an error loading post by the id ${postId}. Sorry.`}</div>
  )
}

export default PostRoute
