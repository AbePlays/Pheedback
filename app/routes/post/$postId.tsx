import type { Comment, Post, User } from '@prisma/client'
import type { ActionFunction, LoaderFunction, MetaFunction } from 'remix'
import { Form, Link, useActionData, useCatch, useLoaderData, useParams } from 'remix'

import { createComment, getUser } from '~/lib/db.server'
import { db, validateCommentForm } from '~/utils'

type TLoaderData = {
  post: Post & { user: User; comment: (Comment & { user: User })[] }
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
    include: {
      comment: { where: { postId }, include: { user: true } },
      user: true,
    },
  })

  if (!post) {
    throw new Response('Post not found', { status: 404 })
  }

  return { post, user }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData())

  if (formData && formData._action) {
    if (formData._action === 'create') {
      const errors = validateCommentForm(formData)
      if (errors) return errors

      const comment = await createComment(formData)
      if (!comment) {
        throw new Response('Comment could not be created. Sorry', {
          status: 500,
        })
      }
    } else if (formData._action === 'delete') {
      const { commentId } = formData
      if (!commentId || typeof commentId !== 'string') {
        throw new Response('Invalid request', { status: 400 })
      } else {
        await db.comment.delete({ where: { id: commentId } })
      }
    }
  }

  return {}
}

const PostRoute = () => {
  const actionData = useActionData()
  const loaderData = useLoaderData<TLoaderData>()

  const { post, user } = loaderData
  const comments = post.comment
  const author = post.user

  return (
    <div>
      <Link to="/">Go Back</Link>

      {/* Post Info  */}
      <div>
        <div>
          <button>{post.upvotes}</button>
          <div>
            <h2>{author.fullname}</h2>
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
            <div>
              <h2>{`${index + 1}. ${comment.user.fullname}`}</h2>
              <p>@{comment.user.username}</p>
              <p>{comment.content}</p>
            </div>
            {user?.id === comment.userId ? (
              <Form method="post">
                <input type="hidden" name="commentId" value={comment.id} />
                <button type="submit" name="_action" value="delete" aria-label="Delete">
                  x
                </button>
              </Form>
            ) : null}
          </div>
        ))}
      </div>

      {/* Comment Form */}
      <div>
        <Form method="post">
          <input type="hidden" name="postId" value={post.id} />
          <input type="hidden" name="userId" value={user?.id} />
          <label htmlFor="comment-input">Add Comment</label>
          <input
            className="block border"
            disabled={!user?.id}
            id="comment-input"
            name="comment"
            placeholder="Type your comment here"
            type="text"
            defaultValue={actionData?.fields?.comment}
            aria-invalid={Boolean(actionData?.fieldErrors?.comment)}
            aria-describedby={actionData?.fieldErrors?.comment ? 'comment-error' : undefined}
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
          <button disabled={!user?.id} type="submit" name="_action" value="create">
            Post Comment
          </button>
          {!user?.id ? (
            <p>
              Please <Link to="/auth">log in</Link> to comment
            </p>
          ) : null}
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

  return <div>{`There was an error loading post by the id ${postId}. Sorry.`}</div>
}

export default PostRoute
