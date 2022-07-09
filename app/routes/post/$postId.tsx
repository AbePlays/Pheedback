import type { Comment, Post, Upvote, User } from '@prisma/client'
import { useEffect, useRef } from 'react'
import type { ActionFunction, HeadersFunction, LoaderFunction, MetaFunction } from 'remix'
import { Form, Link, useActionData, useCatch, useLoaderData, useTransition } from 'remix'

import { Button, Card, ErrorToast, Feedback } from '~/components'
import { Comments } from '~/containers'
import { IconArrowBack } from '~/icons'
import { createComment, getUser } from '~/lib/db.server'
import { db, validateCommentForm } from '~/utils'

type TLoaderData = {
  post: Post & { user: User; comments: (Comment & { user: User })[]; upvotes: Upvote[] }
  user: User
}

export const headers: HeadersFunction = () => {
  return { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59' }
}

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `${data.post.title || 'Post'} | Pheedback`,
    description: `${data.post.detail || 'Checkout this post'}`,
  }
}

export const loader: LoaderFunction = async ({ params, request }) => {
  //TODO: Parallelize fetching user and post data
  const { postId } = params
  const user = await getUser(request)

  const post = await db.post.findUnique({
    where: { id: postId },
    include: {
      comments: {
        where: { postId },
        include: { user: { select: { fullname: true, username: true } } },
        orderBy: { createdAt: 'desc' },
      },
      user: { select: { username: true } },
      upvotes: true,
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
      const { commentId, userId } = formData
      if (!commentId || typeof commentId !== 'string' || !userId || typeof userId !== 'string') {
        throw new Response('Invalid request', { status: 400 })
      } else {
        await db.comment.delete({ where: { id: commentId } })
      }
    }
  }

  return {}
}

export default function PostRoute() {
  const actionData = useActionData()
  const loaderData = useLoaderData<TLoaderData>()
  const transition = useTransition()

  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { post, user } = loaderData
  const comments = post.comments
  const isAdding = transition.submission?.formData.get('_action') === 'create'

  useEffect(() => {
    if (!isAdding && inputRef.current) {
      inputRef.current.value = ''
    }
  }, [isAdding])

  return (
    <div className="mx-auto max-w-screen-xl p-4">
      <Link
        className="group ml-0 mt-0 flex w-max items-center justify-start gap-2 dark:text-gray-200 sm:ml-4 sm:mt-4"
        prefetch="intent"
        to="/"
      >
        <IconArrowBack className="transition-all duration-300 group-hover:-translate-x-1" />
        Go Home
      </Link>

      <main className="mx-auto my-8 max-w-screen-md space-y-4 sm:space-y-8">
        {/* Edit Feedback */}
        {user?.id === post.userId ? (
          <Link
            className="link-btn ml-auto flex w-max items-center justify-center px-8 text-white"
            prefetch="intent"
            to={`/post/edit/${post.id}`}
          >
            Edit Feedback
          </Link>
        ) : null}

        {/* Post Info  */}
        <div className="relative ">
          <Feedback post={post} user={loaderData.user} />
        </div>

        {/* Comments */}
        <Card>
          <Comments comments={comments} user={user} />
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
              className="mt-4 w-full rounded-lg border border-gray-300 bg-gray-100 p-4 outline-none focus:ring-2 focus:ring-fuchsia-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:ring-fuchsia-400"
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
              <p className="mt-4 text-sm text-red-600" role="alert">
                {actionData.formError}
              </p>
            ) : null}
            <Button className="ml-auto mt-4 block w-max" disabled={!user?.id} name="_action" value="create">
              Post Comment
            </Button>
            {!user?.id ? (
              <p className="mt-4 text-center text-red-600">
                Please{' '}
                <Link className="underline" prefetch="intent" to="/auth">
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

export function CatchBoundary() {
  const caught = useCatch()

  switch (caught.status) {
    case 404:
      return (
        <ErrorToast>
          <p>Post not found.</p>
          <Link className="inline-block underline" prefetch="intent" to="/">
            Go Home
          </Link>
        </ErrorToast>
      )
    default: {
      throw new Error(`Unhandled error: ${caught.status}`)
    }
  }
}

export function ErrorBoundary() {
  return (
    <ErrorToast>
      <p>Sorry. There was an error loading the post.</p>
      <Link className="inline-block underline" prefetch="intent" to="/">
        Go Home
      </Link>
    </ErrorToast>
  )
}
