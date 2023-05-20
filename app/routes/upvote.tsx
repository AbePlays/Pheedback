import { redirect, type ActionArgs, type LoaderFunction } from '@remix-run/node'

import { toggleUpvote } from '~/lib/db.server'
import { validateUpvoteForm } from '~/utils'

export async function action({ request }: ActionArgs) {
  const formData = Object.fromEntries(await request.formData())

  const errors = validateUpvoteForm(formData)
  if (errors) return errors

  return toggleUpvote(formData)
}

export const loader: LoaderFunction = () => redirect('/roadmap')
