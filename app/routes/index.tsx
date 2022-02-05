import type { LoaderFunction, MetaFunction } from 'remix'
import { Form, useLoaderData } from 'remix'

import { getUser } from '~/lib/db.server'

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => {
  return {
    title: 'Home | Pheedback',
    description: 'Welcome to Pheedback!',
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  return { user }
}

// https://remix.run/guides/routing#index-routes
const IndexRoute = () => {
  const loaderData = useLoaderData()

  return (
    <div>
      <main className="text-center">
        {loaderData?.user ? (
          <div>
            <h2>{loaderData.user?.fullname}</h2>
            <span>@{loaderData.user?.username}</span>
            <Form action="/logout" method="post">
              <button type="submit">Logout</button>
            </Form>
          </div>
        ) : null}
        <h2 className="font-bold text-red-900 first-letter:text-xl">
          Welcome to Pheedback!
        </h2>
        <p className="text-green-800">We're stoked that you're here. 🥳</p>
        <p className="text-cyan-500">Content coming soon!</p>
      </main>
    </div>
  )
}

export default IndexRoute
