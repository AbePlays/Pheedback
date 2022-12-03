import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node'

import { logout } from '~/lib/db.server'

export const action: ActionFunction = ({ request }) => logout(request)

export const loader: LoaderFunction = () => redirect('/')
