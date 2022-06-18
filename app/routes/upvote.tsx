import type { ActionFunction, LoaderFunction } from 'remix'
import { redirect } from 'remix'

import { toggleUpvote } from '~/lib/db.server'
import { validateUpvoteForm } from '~/utils'

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData())

  const errors = validateUpvoteForm(formData)
  if (errors) return errors

  return toggleUpvote(formData)
}

export const loader: LoaderFunction = () => redirect('/')
