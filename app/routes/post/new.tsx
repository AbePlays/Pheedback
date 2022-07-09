import type { ActionFunction, LoaderFunction, MetaFunction } from 'remix'
import { Form, Link, redirect, useActionData, useCatch, useTransition } from 'remix'

import { Button, Card, Input } from '~/components'
import { categoryOptions } from '~/data'
import { IconArrowBack, IconLoading } from '~/icons'
import { createPost, getUserId } from '~/lib/db.server'
import { validatePostForm } from '~/utils'

export const meta: MetaFunction = () => {
  return {
    title: 'Create | Pheedback',
    description: 'Create a Pheedback',
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request)
  if (!userId) throw new Response('Unauthorized', { status: 401 })
  return {}
}

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData())

  const errors = validatePostForm(formData)
  if (errors) return errors

  const userId = await getUserId(request)
  if (!userId) return redirect('/auth')

  return createPost(formData, userId)
}

export default function NewPostRoute() {
  const actionData = useActionData()
  const transition = useTransition()

  const isFormSubmitting = Boolean(transition.submission)

  return (
    <main className="mx-auto max-w-screen-xl p-4">
      <Link
        className="group ml-0 mt-0 flex w-max items-center justify-start gap-2 dark:text-gray-200 sm:ml-4 sm:mt-4"
        prefetch="intent"
        to="/"
      >
        <IconArrowBack className="transition-all duration-300 group-hover:-translate-x-1" />
        Go Home
      </Link>
      <Card className="mx-auto mt-8 max-w-screen-sm sm:p-12">
        <h1 className="text-xl font-bold sm:text-2xl">Create New Feedback</h1>
        <Form className="mt-8" method="post">
          <label className="font-bold" htmlFor="title-input">
            Feedback Title
            <br />
            <span className="font-normal text-gray-500">Add a short, descriptive headline</span>
          </label>
          <Input
            className="mt-4 mb-8"
            defaultValue={actionData?.fields?.title}
            id="title-input"
            name="title"
            type="text"
            aria-invalid={Boolean(actionData?.fieldErrors?.title)}
            aria-describedby={actionData?.fieldErrors?.title ? 'title-error' : undefined}
          />
          {actionData?.fieldErrors?.title ? (
            <p className="-mt-4 mb-4 text-sm text-red-600" id="title-error" role="alert">
              {actionData.fieldErrors.title}
            </p>
          ) : null}

          <label className="font-bold" htmlFor="category-input">
            Category
            <br />
            <span className="font-normal text-gray-500">Choose a category for your feedback</span>
          </label>
          <select
            className="mt-4 mb-8 block h-12 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 outline-none focus:ring-2 focus:ring-fuchsia-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:ring-fuchsia-400"
            defaultValue={actionData?.fields?.category}
            id="category-input"
            name="category"
            aria-invalid={Boolean(actionData?.fieldErrors?.category)}
            aria-describedby={actionData?.fieldErrors?.category ? 'category-error' : undefined}
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {actionData?.fieldErrors?.category ? (
            <p className="mb-4 -mt-4 text-sm text-red-600" id="category-error" role="alert">
              lol
              {actionData.fieldErrors.category}
            </p>
          ) : null}

          <label className="font-bold" htmlFor="detail-input">
            Feedback Detail
            <br />
            <span className="font-normal text-gray-500">
              Include any specific comments on what should be improved, added, etc.
            </span>
          </label>
          <textarea
            className="mt-4 mb-8 w-full rounded-lg border border-gray-300 bg-gray-100 p-4 outline-none focus:ring-2 focus:ring-fuchsia-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:ring-fuchsia-400"
            defaultValue={actionData?.fields?.detail}
            id="detail-input"
            name="detail"
            rows={4}
            aria-invalid={Boolean(actionData?.fieldErrors?.detail)}
            aria-describedby={actionData?.fieldErrors?.detail ? 'detail-error' : undefined}
          />
          {actionData?.fieldErrors?.detail ? (
            <p className="-mt-4 mb-4 text-sm text-red-600" id="detail-error" role="alert">
              {actionData.fieldErrors.detail}
            </p>
          ) : null}

          {actionData?.formError ? (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {actionData.formError}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col justify-end gap-4 sm:flex-row">
            <Button className="sm:w-max">
              {isFormSubmitting ? (
                <>
                  <IconLoading className="mr-2" />
                  Submitting...
                </>
              ) : (
                'Add Feedback'
              )}
            </Button>
            <Link
              className="link-btn flex items-center justify-center bg-indigo-500 px-8 text-white focus:ring-indigo-500"
              prefetch="intent"
              to="/"
            >
              Cancel
            </Link>
          </div>
        </Form>
      </Card>
    </main>
  )
}

export const CatchBoundary = () => {
  const caught = useCatch()

  if (caught.status === 401) {
    return (
      <div className="mx-auto max-w-md p-4" role="alert">
        <main className="space-y-2 rounded-lg border border-red-200 bg-red-100 p-4 text-center text-red-500 shadow duration-500 animate-in slide-in-from-top-full">
          <p>You must be logged in to create a post.</p>
          <Link className="inline-block underline" prefetch="intent" to="/auth">
            Log in
          </Link>
        </main>
      </div>
    )
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
