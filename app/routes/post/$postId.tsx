import type { Comment, Post, User } from '@prisma/client'
import type { ActionFunction, LoaderFunction, MetaFunction } from 'remix'
import { Form, Link, useActionData, useCatch, useLoaderData, useParams, useTransition } from 'remix'
import { useEffect, useRef } from 'react'

import { Button, Card, Feedback } from '~/components'
import { IconArrowBack, IconCross } from '~/icons'
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
  const transition = useTransition()

  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { post, user } = loaderData
  const comments = post.comment
  const isAdding = transition.submission && transition.submission.formData.get('_action') === 'create'

  useEffect(() => {
    if (!isAdding && inputRef.current) {
      inputRef.current.value = ''
    }
  }, [isAdding])

  return (
    <div className="mx-auto max-w-screen-xl p-4">
      <Link className="group ml-0 mt-0 flex w-max items-center justify-start gap-2 sm:ml-4 sm:mt-4" to="/">
        <IconArrowBack className="transition-all duration-300 group-hover:-translate-x-1" />
        Go Home
      </Link>

      <main className="mx-auto my-8 max-w-screen-md space-y-4 sm:space-y-8">
        {/* Post Info  */}
        <div className="relative ">
          <Feedback post={post} />
        </div>
        {/* Comments */}
        <Card>
          <h2 className="font-bold">
            {comments.length} Comment{comments.length > 1 && 's'}
          </h2>
          {comments.map((comment) => (
            <div className="my-8 px-4" key={comment.id}>
              <div className="flex justify-between gap-4">
                <div className="flex flex-1 gap-4">
                  {/* Implement logic for image seed */}
                  <img alt="user avatar" className="h-10 w-10" src="https://avatars.dicebear.com/api/human/339.svg" />
                  <div>
                    <h2 className="font-bold">{comment.user.fullname}</h2>
                    <p className="text-gray-500">@{comment.user.username}</p>
                    <p className="mt-2 text-gray-600">{comment.content}</p>
                  </div>
                </div>
                {user?.id === comment.userId ? (
                  <Form method="post">
                    <input type="hidden" name="commentId" value={comment.id} />
                    <Button name="_action" value="delete" variant="unstyled" aria-label="Delete">
                      <IconCross />
                    </Button>
                  </Form>
                ) : null}
              </div>
            </div>
          ))}
        </Card>

        {/* Comment Form */}
        <Card>
          <Form method="post">
            <input type="hidden" name="postId" value={post.id} />
            <input type="hidden" name="userId" value={user?.id} />
            <label className="font-bold" htmlFor="comment-input">
              Add Comment
            </label>
            <textarea
              className="mt-4 w-full rounded-lg bg-gray-100 p-4"
              disabled={!user?.id}
              id="comment-input"
              name="comment"
              placeholder="Type your comment here"
              ref={inputRef}
              rows={4}
              defaultValue={actionData?.fields?.comment}
              aria-invalid={Boolean(actionData?.fieldErrors?.comment)}
              aria-describedby={actionData?.fieldErrors?.comment ? 'comment-error' : undefined}
            />
            {actionData?.fieldErrors?.comment ? (
              <p className="mt-4 text-sm text-red-600" id="comment-error" role="alert">
                {actionData.fieldErrors.comment}
              </p>
            ) : null}

            {actionData?.formError ? (
              <p className="mt-4 text-sm text-red-600" id="comment-error" role="alert">
                {actionData.formError}
              </p>
            ) : null}
            <Button className="ml-auto mt-4 block w-max" disabled={!user?.id} name="_action" value="create">
              Post Comment
            </Button>
            {!user?.id ? (
              <p className="mt-4 text-center text-red-600">
                Please{' '}
                <Link className="underline" to="/auth">
                  log in
                </Link>{' '}
                to comment
              </p>
            ) : null}
          </Form>
        </Card>
      </main>
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
