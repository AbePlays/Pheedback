import { ActionArgs, LoaderArgs, redirect } from '@remix-run/node'
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
  type V2_MetaFunction,
} from '@remix-run/react'
import React from 'react'

import { Button, Card, Input, Modal } from '~/components'
import { categoryOptions, statusOptions } from '~/data'
import { IconArrowBack, IconLoading } from '~/icons'
import { getUser } from '~/lib/db.server'
import { db, validateEditPostForm } from '~/utils'

export const meta: V2_MetaFunction = () => [{ title: 'Edit Post | Pheedback', description: 'Edit this post' }]

export async function loader({ params, request }: LoaderArgs) {
  const { id: postId } = params
  const user = await getUser(request)

  if (!user) throw new Response('Unauthorized', { status: 401 })

  const post = await db.post.findUnique({ where: { id: postId } })
  if (!post) {
    throw new Response('Post not found', { status: 404 })
  }

  return { post, user }
}

export async function action({ request }: ActionArgs) {
  const formData = Object.fromEntries(await request.formData())

  if (formData && formData._action) {
    if (formData._action === 'edit') {
      const errors = validateEditPostForm(formData)
      if (errors) return errors

      const post = await db.post.update({
        where: { id: String(formData.id) },
        data: {
          title: String(formData.title),
          detail: String(formData.detail),
          category: String(formData.category),
          status: String(formData.status),
        },
      })
      if (!post) {
        throw new Response('Post could not be updated. Sorry', {
          status: 500,
        })
      }
    } else if (formData._action === 'delete') {
      const { id: postId } = formData
      if (!postId || typeof postId !== 'string') {
        throw new Response('Invalid request', { status: 400 })
      }

      const post = await db.post.delete({ where: { id: postId } })
      if (!post) {
        throw new Response('Post could not be deleted. Sorry', {
          status: 500,
        })
      }

      return redirect('/')
    }
  }

  return redirect(`/post/${formData.id}`)
}

export default function EditPostRoute() {
  const actionData = useActionData()
  const loaderData = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const formRef = React.useRef<HTMLFormElement>(null)
  const submit = useSubmit()

  const { post } = loaderData
  const isSaving = navigation.formData?.get('_action') === 'edit'
  const isDeleting = navigation.formData?.get('_action') === 'delete'

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
        <h1 className="text-xl font-bold sm:text-2xl">Edit Feedback</h1>
        <Form className="mt-8" method="post" ref={formRef}>
          <input name="id" type="hidden" value={post.id} />
          <label className="font-bold" htmlFor="title-input">
            Feedback Title
            <br />
            <span className="font-normal text-gray-500">Add a short, descriptive headline</span>
          </label>
          <Input
            className="mb-8 mt-4"
            defaultValue={post?.title}
            id="title-input"
            name="title"
            type="text"
            aria-invalid={Boolean(actionData?.fieldErrors?.title)}
            aria-describedby={actionData?.fieldErrors?.title ? 'title-error' : undefined}
          />
          {actionData?.fieldErrors?.title ? (
            <p className="mt-4 text-sm text-red-600" id="title-error" role="alert">
              {actionData.fieldErrors.title}
            </p>
          ) : null}

          <label className="font-bold" htmlFor="category-input">
            Category
            <br />
            <span className="font-normal text-gray-500">Choose a category for your feedback</span>
          </label>
          <select
            className="mb-8 mt-4 block h-12 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 outline-none focus:ring-2 focus:ring-fuchsia-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:ring-fuchsia-400"
            defaultValue={post?.category}
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
            <p className="mt-4 text-sm text-red-600" id="category-error" role="alert">
              {actionData.fieldErrors.category}
            </p>
          ) : null}

          <label className="font-bold" htmlFor="status-input">
            Update Status
            <br />
            <span className="font-normal text-gray-500">Change feedback state</span>
          </label>
          <select
            className="mb-8 mt-4 block h-12 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 outline-none focus:ring-2 focus:ring-fuchsia-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:ring-fuchsia-400"
            defaultValue={post?.status}
            id="status-input"
            name="status"
            aria-invalid={Boolean(actionData?.fieldErrors?.status)}
            aria-describedby={actionData?.fieldErrors?.status ? 'status-error' : undefined}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {actionData?.fieldErrors?.status ? (
            <p className="mt-4 text-sm text-red-600" id="status-error" role="alert">
              {actionData.fieldErrors.status}
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
            className="mb-8 mt-4 w-full rounded-lg border border-gray-300 bg-gray-100 p-4 outline-none focus:ring-2 focus:ring-fuchsia-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:ring-fuchsia-400"
            defaultValue={post?.detail}
            id="detail-input"
            name="detail"
            rows={4}
            aria-invalid={Boolean(actionData?.fieldErrors?.detail)}
            aria-describedby={actionData?.fieldErrors?.detail ? 'detail-error' : undefined}
          />
          {actionData?.fieldErrors?.detail ? (
            <p className="mt-4 text-sm text-red-600" id="detail-error" role="alert">
              {actionData.fieldErrors.detail}
            </p>
          ) : null}

          {actionData?.formError ? (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {actionData.formError}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col justify-end gap-4 sm:flex-row">
            <Modal>
              <Modal.Button asChild>
                <Button className="mr-auto flex w-full items-center justify-center bg-red-600 focus:ring-red-600 sm:w-max">
                  Delete
                </Button>
              </Modal.Button>

              <Modal.Content title="Are you absolutely sure?">
                <p className="mt-6">
                  This action cannot be undone. This will permanently delete your post and remove your data from our
                  servers.
                </p>

                <div className="mt-6 flex gap-4 justify-end">
                  <Modal.Close asChild>
                    <Button className="bg-red-600 focus:ring-red-600 max-w-fit" disabled={isDeleting}>
                      Cancel
                    </Button>
                  </Modal.Close>
                  <Button
                    className="max-w-fit"
                    disabled={isDeleting}
                    onClick={() => {
                      const formData = new FormData(formRef.current!)
                      formData.set('_action', 'delete')
                      submit(formData, { method: 'POST' })
                    }}
                  >
                    {isDeleting ? <IconLoading className="mr-2" /> : null}
                    Okay
                  </Button>
                </div>
              </Modal.Content>
            </Modal>

            <Button className="flex items-center justify-center sm:w-max" name="_action" type="submit" value="edit">
              {isSaving ? (
                <>
                  <IconLoading className="mr-2" />
                  Submitting...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>

            <Link
              className="link-btn flex items-center justify-center bg-indigo-500 px-8 font-medium text-white focus:ring-indigo-500"
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
