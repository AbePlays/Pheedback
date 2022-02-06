import type { ActionFunction, LoaderFunction, MetaFunction } from 'remix'
import {
  Form,
  Link,
  redirect,
  useActionData,
  useCatch,
  useTransition,
} from 'remix'

import { categoryOptions } from '~/data'
import { createPost, getUserId } from '~/lib/db.server'
import { validatePostForm } from '~/utils'

export const meta: MetaFunction = () => {
  return {
    title: 'Create | Pheedback',
    description: 'Create a Post',
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

const NewPostRoute = () => {
  const actionData = useActionData()
  const transition = useTransition()

  const isFormSubmitting = transition.submission

  return (
    <div>
      <Link to="/">Go Back</Link>
      <div>
        <h2>Create New Feedback</h2>
        <Form method="post">
          <label htmlFor="title-input">
            Feedback Title
            <br />
            <span>Add a short, descriptive headline</span>
          </label>
          <input
            className="block border"
            defaultValue={actionData?.fields?.title}
            id="title-input"
            name="title"
            type="text"
            aria-invalid={Boolean(actionData?.fieldErrors?.title)}
            aria-describedby={
              actionData?.fieldErrors?.title ? 'title-error' : undefined
            }
          />
          {actionData?.fieldErros?.title ? (
            <p id="title-error" role="alert">
              {actionData.fieldErros.title}
            </p>
          ) : null}

          <label htmlFor="category-input">
            Category
            <br />
            <span>Choose a category for your feedback</span>
          </label>
          <select
            className="block border"
            defaultValue={actionData?.fields?.category}
            id="category-input"
            name="category"
            aria-invalid={Boolean(actionData?.fieldErrors?.category)}
            aria-describedby={
              actionData?.fieldErrors?.category ? 'category-error' : undefined
            }
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {actionData?.fieldErros?.category ? (
            <p id="category-error" role="alert">
              {actionData.fieldErros.category}
            </p>
          ) : null}

          <label htmlFor="detail-input">
            Feedback Detail
            <br />
            <span>
              Include any specific comments on what should be improved, added,
              etc.
            </span>
          </label>
          <textarea
            className="block border"
            defaultValue={actionData?.fields?.detail}
            id="detail-input"
            name="detail"
            aria-invalid={Boolean(actionData?.fieldErrors?.detail)}
            aria-describedby={
              actionData?.fieldErrors?.detail ? 'detail-error' : undefined
            }
          />
          {actionData?.fieldErros?.detail ? (
            <p id="detail-error" role="alert">
              {actionData.fieldErros.detail}
            </p>
          ) : null}

          {actionData?.formError ? (
            <p role="alert">{actionData.formError}</p>
          ) : null}
          <button type="submit">
            {isFormSubmitting ? 'Submitting...' : 'Add Feedback'}
          </button>
          <Link to="/">Cancel</Link>
        </Form>
      </div>
    </div>
  )
}

export const CatchBoundary = () => {
  const caught = useCatch()

  if (caught.status === 401) {
    return (
      <div>
        <p>You must be logged in to create a post.</p>
        <Link to="/auth">Log in</Link>
      </div>
    )
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}

export default NewPostRoute
